
var C = require('./_carolina');
var Schema = require('./models/schema');

var aws = require('aws-sdk');
var yaml = require('yamljs');

var dynamoDB = new aws.DynamoDB({
  endpoint: "https://dynamodb." + process.env.AWS_REGION + ".amazonaws.com"
});

function getModelSchema(app, model, cb) {
  C.getModelSchema(app, model)
  .then(function(schemaYaml) {
    cb(null, yaml.parse(schemaYaml));
  });
}

function deleteObject(app, model, value, cb) {
  C.getModelSchema(app, model)
  .then(function(schemaYaml) {

    var schema = new Schema(yaml.parse(schemaYaml));
    var params = {
      Key: schema.getLookupKey(value),
      TableName: C.getTablePrefix() + app + '_' + model
    };

    dynamoDB.deleteItem(params, function(err, data) {
      if (err) cb(err);
      else {
        cb(null, data);
      }
    });
  })
  .catch(function(err) {
    cb(err);
  });
}

function insertObject(app, model, obj, cb) {
  C.getModelSchema(app, model)
  .then(function(schemaYaml) {

    var schema = new Schema(yaml.parse(schemaYaml));
    var params = {
      Key: schema.getLookupKey(obj[schema.keyField]),
      TableName: C.getTablePrefix() + app + '_' + model
    };

    dynamoDB.getItem(params, function(err, data) {
      if (err) cb(err);
      else {
        if (data.hasOwnProperty('Item'))
          cb("Already exists.");
        else {
          var params = {
            TableName: C.getTablePrefix() + app + '_' + model,
            Item: schema.toInsertObj(obj)
          };
          dynamoDB.putItem(params, function(err, data) {
            if (err) cb(err);
            else cb(null, data);
          });
        }
      }
    });
  });
}

function listModels(cb) {
  C.listPrivateFiles('_carolina/models/')
  .then(function(contents) {

    var models = [];
    for (var i = 0; i < contents.length; ++i) {

      var splitKey = contents[i].Key.split('/');
      var fileName = splitKey[3];
      var m = {};

      m.app = splitKey[2];
      m.model = fileName.slice(0, fileName.indexOf('.yml'));
      models.push(m);
    }

    cb(null, models);
  })
  .catch(function(err) {
    cb(err);
  });
}

var lookupObject = function(app, model, value, cb) {
  C.getModelSchema(app, model)
  .then(function(schemaYaml) {

    var schema = new Schema(yaml.parse(schemaYaml));
    var params = {
      Key: schema.getLookupKey(value),
      TableName: C.getTablePrefix() + app + '_' + model
    };

    dynamoDB.getItem(params, function(err, data) {
      if (err) cb(err);
      else {
        if (data.Item)
          cb(null, schema.fromDB(data.Item));
        else {
          cb(null, null);
        }
      }
    });
  })
  .catch(function(err) {
    cb(err);
  });
};

// passes to dynamoDB.scan
function query(app, model, query, cb) {
  C.getModelSchema(app, model)
  .then(function(schemaYaml) {

    var schema = new Schema(yaml.parse(schemaYaml));
    var params = query;

    params.TableName = C.getTablePrefix() + app + '_' + model;

    dynamoDB.scan(params, function(err, data) {
      if(err) cb(err);
      else {
        var returnValues = [];
        for (var i = 0; i < data.Items.length; ++i) {
          returnValues.push(schema.fromDB(data.Items[i]));
        }
        cb(null, returnValues);
      }
    });
  })
}

function upsertObject(app, model, obj, cb) {
  C.getModelSchema(app, model)
  .then(function(schemaYaml) {

    var schemaObj = yaml.parse(schemaYaml);
    var schema = new Schema(schemaObj);
    var params = {
      TableName: C.getTablePrefix() + app + '_' + model,
      Item: schema.toInsertObj(obj)
    };

    dynamoDB.putItem(params, function(err, data) {
      if (err) cb(err);
      else cb(null, data);
    });
  })
  .catch(function(err) {
    cb(err);
  });
}

exports.handler = function(event, context, callback) {
  if (!event.action) callback("No action specified.");
  switch(event.action) {
    case 'list-models':
      listModels(callback);
      break;
    case 'get-model-schema':
      getModelSchema(event.app, event.model, callback);
      break;
    case 'create':
      insertObject(event.app, event.model, event.obj, callback);
      break;
    case 'lookup':
      lookupObject(event.app, event.model, event.value, callback);
      break;
    case 'query':
      query(event.app, event.model, event.query, callback);
      break;
    case 'upsert':
      upsertObject(event.app, event.model, event.obj, callback);
      break;
    case 'delete':
      deleteObject(event.app, event.model, event.value, callback);
      break;
    default:
      callback("Invalid action provided.");
  }
};
