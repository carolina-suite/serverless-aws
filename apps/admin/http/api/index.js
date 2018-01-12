
var C = require('./_carolina');

exports.handler = function(event, context, callback) {

  var loginServiceGetUser = {
    action: 'get-user'
  };
  var body = JSON.parse(event.body);

  if (body.token) {
    loginServiceGetUser.token = body.token
  };
  C.invokeService('auth', 'LoginService', loginServiceGetUser)
  .then(function(user) {
    if (!user.isAdmin) C.send400({ errorMessage: "Must be admin." }, callback);
    else {
      C.invokeService('admin', 'AdminService', JSON.parse(event.body))
      .then(function(data) {
        C.sendResponse(data, callback);
      })
      .catch(function(err) {
        C.send400(err, callback);
      });
    }
  })
  .catch(function(err) {
    C.send400(err, callback);
  });
};
