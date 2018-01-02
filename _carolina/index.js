
var path = require('path');

var fs = require('fs-extra');
var mime = require('mime-types');
var pug = require('pug');
var yaml = require('yamljs');

var newState = require('./lib/new-state');
var walk = require('./lib/walk');

var Schema = require('./models/schema');

class CarolinaLib {

  constructor(config) {

    this.config = config;
    this.state = {};

    this.dbEndpoint = `https://dynamodb.${this.config.awsRegion}.amazonaws.com`;

    this.AWS = require('aws-sdk');
    this.AWS.config.credentials = new this.AWS.SharedIniFileCredentials({
      profile: config.awsProfile
    });
    this.AWS.config.update({
      region: config.awsRegion
    });

    this.DynamoDB = new this.AWS.DynamoDB({
      endpoint: this.dbEndpoint
    });
    this.DocumentClient = new this.AWS.DynamoDB.DocumentClient();
    this.S3 = new this.AWS.S3();

    if (!fs.existsSync('.state')) {
      this.state = newState();
    }
    else {
      this.state = JSON.parse(fs.readFileSync('.state').toString());
    }

    this.publicBucketName = `${this.config.slug}-${this.state.siteSuffix}-public`;
    this.privateBucketName = `${this.config.slug}-${this.state.siteSuffix}-private`;
    this.publicUrl = `http://${this.publicBucketName}.s3-website-${this.config.awsRegion}.amazonaws.com`;

    this.allApps = ['_carolina', 'home'].concat(this.config.apps);
  }

  async createTable(params) {

    var self = this;

    return new Promise(function(resolve, reject) {
      self.DynamoDB.createTable(params, function(err, data) {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  async createTables() {
    if (!this.state.createdTables) {
      this.state.createdTables = [];
    }
    for (var i = 0; i < this.allApps.length; ++i) {

      var self = this;
      var appName = this.allApps[i];

      if (fs.existsSync(`apps/${appName}/models`)) {
        walk(`apps/${appName}/models`).map(async function(fpath) {

          var modelName = fpath.split(`apps/${appName}/models/`)[1].split('.yml')[0];
          if (self.state.createdTables.indexOf(modelName) != -1) { return; }

          var tableName = `${self.config.slug}_${self.state.siteSuffix}_${appName}_${modelName}`;
          var modelConfig = yaml.load(fpath);
          var modelSchema = new Schema(modelConfig);
          var params = {
            TableName: tableName,
            KeySchema: modelSchema.toKeySchema(),
            AttributeDefinitions: modelSchema.toAttributeDefinitions(),
            ProvisionedThroughput: {
              ReadCapacityUnits: 10,
              WriteCapacityUnits: 10
            }
          };

          console.log(params)
          await self.createTable(params);
          self.state.createdTables.push(modelName);
        });
      }
    }
  }

  async gatherFixtures() {

    fs.ensureDirSync('.fixtures');

    for (var i = 0; i < this.allApps.length; ++i) {
      var appName = this.allApps[i];
      if (fs.existsSync(`apps/${appName}/fixtures`)) {
        fs.copySync(`apps/${appName}/fixtures`,
          `.fixtures/${appName}`);
      }
    }
  }

  async putFixtureItem(item) {

    var self = this;

    return new Promise(function(resolve, reject) {

      var model = yaml.load(`apps/${item.model.app}/models/${item.model.model}.yml`);
      var schema = new Schema(model);
      var itemParam = {};
      var keyType = 'S';

      if (model.fields[model.keyField].type == 'Number') keyType = 'N';

      var params = {
        TableName: `${self.config.slug}_${self.state.siteSuffix}_${item.model.app}_${item.model.model}`,
        Item: schema.toInsertObj(item.fields)
      }

      self.DynamoDB.putItem(params, function(err, data) {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  async gatherPrerenderTemplates() {

    fs.ensureDirSync('.prerender');

    for (var i = 0; i < this.allApps.length; ++i) {
      var appName = this.allApps[i];
      if (fs.existsSync(`apps/${appName}/prerender/pug`)) {
        fs.copySync(`apps/${appName}/prerender/pug`,
          `.prerender/${appName}`);
      }
    }
  }

  async doPrerender() {
    // there should be no prerender for _carolina
    for (var i = 1; i < this.allApps.length; ++i) {
      var appName = this.allApps[i];
      if (fs.existsSync(`apps/${appName}/prerender/config.js`)) {
        var prerenderConfig = require(`../apps/${appName}/prerender/config`);
        for (var j = 0; j < prerenderConfig.prerenderFiles.length; ++j) {
          var prerenderFile = prerenderConfig.prerenderFiles[j];
          fs.writeFileSync(`apps/${appName}/public/${prerenderFile.out}`,
            pug.renderFile(`.prerender/${prerenderFile.in}`, {
              site: this.config,
              prerenderData: prerenderConfig.prerenderData,
              localData: prerenderFile.data
            }));
        }
      }
    }
  }

  async createPublicBucket() {

    var self = this;

    return new Promise(function(resolve, reject) {

      var params = {
        Bucket: self.publicBucketName,
        ACL: 'public-read',
        CreateBucketConfiguration: {
          LocationConstraint: self.config.awsRegion
        }
      };

      self.S3.createBucket(params, function (err, data) {
        if (err) reject(err);
        else {

          self.state.publicBucketExists = true;

          resolve(data);
        }
      });
    });
  }
  async createPrivateBucket() {

    var self = this;

    return new Promise(function(resolve, reject) {

      var params = {
        Bucket: self.privateBucketName,
        ACL: 'private',
        CreateBucketConfiguration: {
          LocationConstraint: self.config.awsRegion
        }
      };

      self.S3.createBucket(params, function (err, data) {
        if (err) reject(err);
        else {

          self.state.privateBucketExists = true;

          resolve(data);
        }
      });
    });
  }
  async configurePublicBucket() {

    var self = this;

    return new Promise(function(resolve, reject) {

      var params = {
        Bucket: self.publicBucketName,
        ContentMD5: '',
        WebsiteConfiguration: {
          ErrorDocument: { Key: 'error.html' },
          IndexDocument: { Suffix: 'index.html' }
        }
      };
      self.S3.putBucketWebsite(params, function(err, data) {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }
  async putS3File(params) {

    var self = this;

    return new Promise(function(resolve, reject) {
      self.S3.putObject(params, function(err, data) {
        if (err) reject(err);
        else resolve(data);
      })
    })
  }

  async fillPublicBucket() {

    var self = this;

    // first copy home files
    walk('apps/home/public').map(async function(fpath) {

      var mType = mime.lookup(fpath);
      if (!mType) mType = 'application/octet-stream';

      var key = fpath.split('apps/home/public/')[1];
      var params = {
        ACL: 'public-read',
        Body: fs.readFileSync(fpath),
        Bucket: self.publicBucketName,
        ContentType: mType,
        Key: key
      };

      await self.putS3File(params);
    });

    for (var i = 0; i < this.config.apps.length; ++i) {
      var appName = this.config.apps[i];
      if (fs.existsSync(`apps/${appName}/public`)) {
        walk(`apps/${appName}/public`).map(async function(fpath) {

          var mType = mime.lookup(fpath);
          if (!mType) mType = 'application/octet-stream';

          var key = `${appName}/` + fpath.split(`apps/${appName}/public/`)[1];
          var params = {
            ACL: 'public-read',
            Body: fs.readFileSync(fpath),
            Bucket: self.publicBucketName,
            ContentType: mType,
            Key: key
          };

          await self.putS3File(params);
        });
      }
    }
  }

  async fillPrivateBucket() {

    var self = this;
    var apps = ['_carolina', 'home'].concat(this.config.apps);

    for (var i = 0; i < apps.length; ++i) {
      var appName = apps[i];
      if (fs.existsSync(`apps/${appName}/private`)) {
        walk(`apps/${appName}/private`).map(async function(fpath) {

          var mType = mime.lookup(fpath);
          if (!mType) mType = 'application/octet-stream';

          var key = `${appName}/` + fpath.split(`apps/${appName}/private/`)[1];
          var params = {
            ACL: 'private',
            Body: fs.readFileSync(fpath),
            Bucket: self.privateBucketName,
            ContentType: mType,
            Key: key
          };

          await self.putS3File(params);
        });
      }
    }
  }

  async putState() {
    await this.putS3File({
      ACL: 'private',
      Body: JSON.stringify(this.state),
      Bucket: this.privateBucketName,
      ContentType: 'application/json',
      Key: '.site/state.json'
    });
  }
  saveState() {
    fs.writeFileSync('.state', JSON.stringify(this.state));
  }
}

module.exports = CarolinaLib;
