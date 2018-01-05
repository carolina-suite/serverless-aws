
var C = require('./_carolina');

exports.handler = function(event, context, callback) {
  C.invokeService('_carolina', 'ModelService', { message: "This is a test." })
    .then(function(data) {
       C.sendResponse(data, callback);
    })
    .catch(function(err) {
      callback(err);
    })
};
