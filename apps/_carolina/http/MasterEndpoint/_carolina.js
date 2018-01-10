
var aws = require('aws-sdk');

var lambda = new aws.Lambda();
var s3 = new aws.S3();

this.getModelSchema = function(app, modelName) {
  return this.getPrivateFile('_carolina', 'models/' + app + '/' + modelName + '.yml', true);
};

this.getPrivateFile = function(app, path, convertToString) {

  var params = {
    Bucket: process.env.privateBucket,
    Key: app + "/" + path
  };
  return new Promise(function(resolve, reject) {
    s3.getObject(params, function(err, data) {
      if (err) reject(err);
      else {
        if (convertToString)
          resolve(String(data.Body));
        else
          resolve(data.Body);
      }
    });
  });
};

this.getSiteConfig = function() {
  var params = {
    Bucket: process.env.privateBucket,
    Key: '.site/config.json'
  };
  return new Promise(function(resolve, reject) {
    s3.getObject(params, function(err, data) {
      if (err) reject(err);
      else {
        resolve(JSON.parse(String(data.Body)));
      }
    });
  });
};

this.getSiteState = function() {
  var params = {
    Bucket: process.env.privateBucket,
    Key: '.site/state.json'
  };
  return new Promise(function(resolve, reject) {
    s3.getObject(params, function(err, data) {
      if (err) reject(err);
      else {
        resolve(JSON.parse(String(data.Body)));
      }
    });
  });
};

this.getSvcPrefix = function() {
  var p = process.env.svcPrefix;
  if (!p.endsWith('_')) p = p + '_';
  return p;
};

this.getTablePrefix = function() {
  return process.env.slug + '_' + process.env.siteSuffix + '_';
};

this.invokeService = function(app, service, args) {

  var params = {
    FunctionName: this.getSvcPrefix() + app + '_' + service,
    Payload: JSON.stringify(args)
  };

  return new Promise(function(resolve, reject) {
    lambda.invoke(params, function(err, data) {
      if (err) reject(err);
      else resolve(JSON.parse(data.Payload));
    });
  });
};

this.listPrivateFiles = function(prefix) {
  return new Promise(function(resolve, reject) {
    var params = {
      Bucket: process.env.privateBucket
    };
    if (prefix) params.Prefix = prefix;
    s3.listObjects(params, function(err, data) {
      if (err) reject(err);
      else resolve(data.Contents);
    });
  });
}

this.sendResponse = function(res, cb) {
  cb(null, {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST,ORIGIN',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(res)
  });
};
