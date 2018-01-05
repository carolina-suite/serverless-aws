
var C = require('./_carolina');

var yaml = require('yamljs');

function listModels() {

}

exports.handler = function(event, context, callback) {

  C.getModelSchema('auth', 'User')
  .then(function(data) {

    var model = yaml.parse(data);

    C.sendResponse({
      fileText: model
    }, callback);
  })
  .catch(function(err) {
    callback(err)
  });
};
