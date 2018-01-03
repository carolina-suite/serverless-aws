
var path = require('path');

var archiver = require('archiver');
var fs = require('fs-extra');
var mime = require('mime-types');
var pug = require('pug');
var yaml = require('yamljs');

var newState = require('./lib/new-state');
var AwsRoles = require('./aws/roles');
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

    this.APIGateway = new this.AWS.APIGateway();
    this.DynamoDB = new this.AWS.DynamoDB({
      endpoint: this.dbEndpoint
    });
    this.DocumentClient = new this.AWS.DynamoDB.DocumentClient();
    this.IAM = new this.AWS.IAM();
    this.Lambda = new this.AWS.Lambda();
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
    this.masterRoleName = `${this.config.slug}_${this.state.siteSuffix}_MasterRole`
    this.apiName = `${this.config.slug}_${this.state.siteSuffix}_api`;

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
          if (self.state.createdTables.indexOf(`${appName}_${modelName}`) != -1) { return; }

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

          await self.createTable(params);
          self.state.createdTables.push(`${appName}_${modelName}`);
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

  async createZip(inputDir, outputFile) {
    return new Promise(function(resolve, reject) {

      var output = fs.createWriteStream(outputFile);
      var archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', function() { resolve() });
      archive.on('error', function(err) { reject(err) });

      archive.pipe(output);
      archive.directory(inputDir, false);
      archive.finalize();
    });
  }

  async createHttpArchives() {
    for (var i = 0; i < this.allApps.length; ++i) {
      var appName = this.allApps[i];
      if (fs.existsSync(`apps/${appName}/http`)) {
        var httpPackages = fs.readdirSync(`apps/${appName}/http`);
        for (var j = 0; j < httpPackages.length; ++j) {

          var httpPackage = `apps/${appName}/http/${httpPackages[j]}`;
          var outfile = `apps/${appName}/private/http/${httpPackages[j]}.zip`;

          fs.ensureDirSync(`apps/${appName}/private/http/`);

          await this.createZip(httpPackage, outfile);
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

  copyModelDefinitions() {
    for (var i = 0; i < this.allApps.length; ++i) {
      var appName = this.allApps[i];
      if (fs.existsSync(`apps/${appName}/models`)) {
        fs.copySync(`apps/${appName}/models`,
          `apps/_carolina/private/models/${appName}`);
      }
    }
  }
  async fillPrivateBucket() {

    this.copyModelDefinitions();
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

  async createMasterRole() {

    if (this.state.roleCreated) return null;
    var self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        AssumeRolePolicyDocument: AwsRoles.lambdaRoleDocument,
        RoleName: self.masterRoleName
      };
      self.IAM.createRole(params, function(err, data) {
        if (err) reject(err);
        else {
          self.state.roleCreated = true;
          self.state.roleARN = data.Role.Arn;
          resolve(data.Role.Arn);
        }
      });
    });
  }

  async addPolicyToMasterRole() {

    if (this.state.roleHasPolicy) return null;
    var self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        PolicyArn: 'arn:aws:iam::aws:policy/AdministratorAccess',
        RoleName: self.masterRoleName
      };
      self.IAM.attachRolePolicy(params, function(err, data) {
        if (err) reject(err);
        else {
          self.state.roleHasPolicy = true;
          resolve(data);
        }
      })
    })
  }

  async createMasterAPI() {

    if (this.state.apiCreated) return null;
    var self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        name: self.apiName
      };
      self.APIGateway.createRestApi(params, function(err, data) {
        if (err) reject(err);
        else {
          self.state.apiCreated = true;
          self.state.apiID = data.id;
          resolve(data);
        }
      });
    });
  }

  async putHttpPackage(app, serviceName) {

    var self = this;
    if (this.state.createdHttpFunctions.indexOf(`${app}_${serviceName}`) != -1)
      return null;

    return new Promise(function(resolve, reject) {
      var params = {
        Code: {
          S3Bucket: self.privateBucketName,
          S3Key: `${app}/http/${serviceName}.zip`
        },
        FunctionName: `${self.config.slug}_${self.state.siteSuffix}_http_${app}_${serviceName}`,
        Handler: 'index.handler',
        Role: self.state.roleARN,
        Runtime: 'nodejs6.10'
      };
      self.Lambda.createFunction(params, function(err, data) {
        if (err) reject(err);
        else {
          self.state.createdHttpFunctions.push(`${app}_${serviceName}`);
          resolve(data);
        }
      });
    });
  }

  async applyPermissionForHttpPackage(app, serviceName) {

    if (this.state.permittedIntegrations.indexOf(`${app}_${serviceName}`) != -1)
      return null;
    var self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        Action: 'lambda:InvokeFunction',
        FunctionName: `${self.config.slug}_${self.state.siteSuffix}_http_${app}_${serviceName}`,
        Principal: 'apigateway.amazonaws.com',
        StatementId: `permit_${self.config.slug}_${self.state.siteSuffix}_http_${app}_${serviceName}`
      };
      self.Lambda.addPermission(params, function(err, data) {
        if (err) reject(err);
        else {
          console.log(`Added API Gateway Permissions for http_${app}_${serviceName}.`);
          self.state.permittedIntegrations.push(`${app}_${serviceName}`);
          resolve(data);
        }
      })
    })
  }

  async putHttpPackages() {
    for (var i = 0; i < this.allApps.length; ++i) {
      var appName = this.allApps[i];
      if (fs.existsSync(`apps/${appName}/http`)) {
        var httpPackages = fs.readdirSync(`apps/${appName}/http`);
        for (var j = 0; j < httpPackages.length; ++j) {
          var httpPackage = httpPackages[j];
          if (fs.existsSync(`apps/${appName}/private/http/${httpPackage}.zip`)) {
            await this.putHttpPackage(appName, httpPackage);
            await this.applyPermissionForHttpPackage(appName, httpPackage);
          }
        }
      }
    }
  }

  async getApiRootId() {

    var self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        restApiId: self.state.apiID
      };
      self.APIGateway.getResources(params, function(err, data) {
        if (err) reject(err);
        else {
          for (var i = 0; i < data.items.length; ++i) {
            if (data.items[i].path == '/') return resolve(data.items[i].id);
          }
          reject("Root Resource not found.");
        }
      });
    });
  }

  async createEndpoint(app, serviceName) {

    var self = this;
    var rootId = await this.getApiRootId();

    if (this.state.createdEndpoints.hasOwnProperty(`${app}_${serviceName}`))
      return null;

    return new Promise(function(resolve, reject) {
      var params = {
        parentId: rootId,
        pathPart: `${app}_${serviceName}`,
        restApiId: self.state.apiID
      };
      self.APIGateway.createResource(params, function(err, data) {
        if (err) reject(err);
        else {
          self.state.createdEndpoints[`${app}_${serviceName}`] = data.id;
          resolve(data);
        }
      });
    });
  }

  async createEndpointMethod(app, serviceName) {

    var self = this;
    var resourceId = this.state.createdEndpoints[`${app}_${serviceName}`];

    if (this.state.createdMethods.indexOf(`${app}_${serviceName}`) != -1)
      return null;

    return new Promise(function(resolve, reject) {
      var params = {
        authorizationType: 'NONE',
        httpMethod: 'POST',
        resourceId: resourceId,
        restApiId: self.state.apiID
      };
      self.APIGateway.putMethod(params, function(err, data) {
        if (err) reject(err);
        else {
          self.state.createdMethods.push(`${app}_${serviceName}`);
          resolve(data);
        }
      });
    });
  }

  async getFunctionArn(app, serviceName) {

    if (this.state.functionArns.hasOwnProperty(`http_${app}_${serviceName}`)) {
      return this.state.functionArns[`http_${app}_${serviceName}`];
    }
    var self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        FunctionName: `${self.config.slug}_${self.state.siteSuffix}_http_${app}_${serviceName}`
      };
      self.Lambda.getFunction(params, function(err, data) {
        if (err) reject(err);
        else {
          self.state.functionArns[`http_${app}_${serviceName}`] = data.Configuration.FunctionArn;
          resolve(data.Configuration.FunctionArn);
        }
      })
    })
  }

  async createEndpointIntegration(app, serviceName) {

    if (this.state.createdIntegrations.indexOf(`${app}_${serviceName}`) != -1) {
      return null;
    }
    var self = this;
    var resourceId = this.state.createdEndpoints[`${app}_${serviceName}`];
    var functionArn = await this.getFunctionArn(app, serviceName);
    var uri = `arn:aws:apigateway:${this.config.awsRegion}:lambda:path/2015-03-31/functions/${functionArn}/invocations`;

    return new Promise(function(resolve, reject) {
      // --uri arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:123456789012:function:HelloWorld/invocations
      var params = {
        httpMethod: 'POST',
        integrationHttpMethod: 'POST',
        resourceId: resourceId,
        restApiId: self.state.apiID,
        type: 'AWS_PROXY',
        uri: uri
      };
      console.log(params);
      self.APIGateway.putIntegration(params, function(err, data) {
        if (err) reject(err);
        else {
          self.state.createdIntegrations.push(`${app}_${serviceName}`);
          resolve(data);
        }
      });
    });
  }

  async createEndpoints() {
    for (var i = 0; i < this.allApps.length; ++i) {
      var appName = this.allApps[i];
      if (fs.existsSync(`apps/${appName}/http`)) {
        var httpPackages = fs.readdirSync(`apps/${appName}/http`);
        for (var j = 0; j < httpPackages.length; ++j) {
          var httpPackage = httpPackages[j];
          if (fs.existsSync(`apps/${appName}/private/http/${httpPackage}.zip`)) {
            await this.createEndpoint(appName, httpPackage);
            await this.createEndpointMethod(appName, httpPackage);
            await this.createEndpointIntegration(appName, httpPackage);
          }
        }
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
