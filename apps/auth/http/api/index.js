
var C = require('./_carolina');

exports.handler = function(event, context, callback) {
  C.invokeService('auth', 'LoginService', JSON.parse(event.body))
  .then(function(data) {
    if (data.hasOwnProperty('salt')) delete data.salt;
    if (data.hasOwnProperty('password')) delete data.password;
    C.sendResponse(data, callback);
  })
  .catch(function(err) {
    callback(err);
  })
};
