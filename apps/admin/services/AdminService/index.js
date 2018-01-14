
var C = require('./_carolina');

function command(app, service, args, cb) {
  C.invokeService(app, service, args)
  .then(function(data) {
    cb(null, data);
  })
  .catch(function(err) {
    cb(err);
  });
}

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
    action: 'delete',
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

function getSchema(app, model, cb) {
  C.invokeService('_carolina', 'ModelService', {
    action: 'get-model-schema',
    app: app,
    model: model
  })
  .then(function(s) {
    cb(null, s);
  })
  .catch(function(err) {
    cb(err);
  });
}

function listObjects(app, model, pageSize, page, cb) {
  C.invokeService('_carolina', 'ModelService', {
    action: 'list',
    app: app,
    model: model,
    pageSize: pageSize,
    page: page
  })
  .then(function(items) {
    cb(null, items);
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

function lookup(app, model, key, cb) {
  C.invokeService('_carolina', 'ModelService', {
    action: 'lookup',
    app: app,
    model: model,
    value: key
  })
  .then(function(o) {
    cb(null, o);
  })
  .catch(function(err) {
    cb(err);
  });
}

function update(app, model, obj, cb) {
  C.invokeService('_carolina', 'ModelService', {
    action: 'upsert',
    app: app,
    model: model,
    obj: obj
  })
  .then(function(o) {
    cb(null, { success: true });
  })
  .catch(function(err) {
    cb(err);
  });
}

exports.handler = function(event, context, callback) {
  if (!event.action) callback("No action specified.");
  switch(event.action) {
    case 'command':
      command(event.app, event.service, event.args, callback);
      break;
    case 'create':
      create(event.app, event.model, event.obj, callback);
      break;
    case 'delete':
      deleteObject(event.app, event.model, event.value, callback);
      break;
    case 'list':
      listObjects(event.app, event.model, event.pageSize, event.page, callback);
      break;
    case 'list-models':
      listModels(callback);
      break;
    case 'lookup':
      lookup(event.app, event.model, event.key, callback);
      break;
    case 'schema':
      getSchema(event.app, event.model, callback);
      break;
    case 'update':
      update(event.app, event.model, event.obj, callback);
      break;
    default:
      callback("Invalid action provided.");
  }
};
