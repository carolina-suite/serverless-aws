
var C = require('./_carolina');

function listModels() {

}

exports.handler = function(event, context, callback) {

  C.getPrivateFile('_carolina', 'models/auth/User.yml', true)
  .then(function(data) {
    C.sendResponse({
      fileText: data
    }, callback);
  })
  .err(function(err) {
    callback(err)
  });
};
