
var C = require('./_carolina');

function create(app, model, obj, cb) {
  C.invokeService('_carolina', 'ModelService', {
    action: 'create',
    app: app,
    model: model,
    obj: obj
  })
  .then(function(data) {
    cb(null, { success: true });
  })
  .catch(function(err) {
    cb(err);
  });
}

function deleteObject(app, model, value, cb) {
  C.invokeService('_carolina', 'ModelService', {
    action: 'create',
    app: app,
    model: model,
    value: value
  })
  .then(function(data) {
    cb(null, { success: true });
  })
  .catch(function(err) {
    cb(err);
  });
}

function listModels(cb) {
  C.invokeService('_carolina', 'ModelService', {
    action: 'list-models'
  })
  .then(function(models) {
    cb(null, models);
  })
  .catch(function(err) {
    cb(err);
  });
}

exports.handler = function(event, context, callback) {
  if (!event.action) callback("No action specified.");
  switch(event.action) {
    case 'create':
      create(event.app, event.model, event.obj, callback);
      break;
    case 'delete':
      deleteObject(event.app, event.model, event.value, callback);
      break;
    case 'list-models':
      listModels(callback);
      break;
    default:
      callback("Invalid action provided.");
  }
};
