
var crypto = require('crypto');

var jwt = require('jsonwebtoken');

var C = require('./_carolina');

// indirect function
function authCheck(token) {

  var tokenValidation = null;

  return new Promise(function(resolve, reject) {
    C.getSiteState()
    .then(function(state) {

      try {
        tokenValidation = jwt.verify(token, state.secret);
      }
      catch(err) {
        reject(err);
      }

      var modelServiceLookup = {
        action: 'lookup',
        app: 'auth',
        model: 'User',
        value: tokenValidation.username
      };
      C.invokeService('_carolina', 'ModelService', modelServiceLookup)
      .then(function(user) {
        resolve(user);
      })
      .catch(function(err) {
        reject(err);
      });
    })
    .catch(function(err) {
      reject(err);
    });
  });
}

function check(token, cb) {
  authCheck(token)
  .then(function(user) {
    if (user) {
      cb(null, { success: true });
    }
    else {
      cb(null, { success: false });
    }
  })
  .catch(function(err) {
    cb(null, { success: false });
  });
}

function forgot(username, email, cb) {
  C.getSiteConfig()
  .then(function(config) {
    var modelServiceLookup = {
      action: 'lookup',
      app: 'auth',
      model: 'User',
      value: username
    };
    C.invokeService('_carolina', 'ModelService', modelServiceLookup)
    .then(function(user) {
      if (user.emailAddress == email) {

        var newSalt = crypto.randomBytes(32).toString('hex');
        var newPass = crypto.randomBytes(16).toString('hex');
        user.password = crypto.pbkdf2Sync(Buffer(newPass), Buffer(newSalt),
          1000, 64, 'sha512').toString('hex');
        user.salt = newSalt;

        var modelServiceUpsert = {
          action: 'upsert',
          app: 'auth',
          model: 'User',
          obj: user
        };
        C.invokeService('_carolina', 'ModelService', modelServiceUpsert)
        .then(function(data) {
          var emailServiceSendEmailTemplate = {
            action: 'send-email-template',
            app: 'auth',
            template: 'password-reset',
            data: {
              siteName: config.name,
              user: user.username,
              password: newPass
            },
            to: [email],
            from: config.siteEmail
          };
          C.invokeService('_carolina', 'EmailService', emailServiceSendEmailTemplate)
          .then(function(data) {
            cb(null, data);
          })
          .catch(function(err) {
            cb(err);
          });
        })
        .catch(function(err) {
          cb(err);
        });
      }
      else {
        cb("Incorrect email address.");
      }
    })
    .catch(function(err) {
      cb(err);
    });
  })
  .catch(function(err) {
    cb(err);
  });
}

function getUser(token, cb) {
  authCheck(token)
  .then(function(user) {
    cb(null, user);
  })
  .catch(function(err) {
    cb(err);
  });
}

function login(username, password, cb) {

  var modelServiceLookup = {
    action: 'lookup',
    app: 'auth',
    model: 'User',
    value: username
  };
  C.invokeService('_carolina', 'ModelService', modelServiceLookup)
  .then(function(user) {
    if (user == null) {
      cb("Invalid username/password combination.");
    }
    else {
      var saltedPass = crypto.pbkdf2Sync(Buffer(password), Buffer(user.salt),
        1000, 64, 'sha512').toString('hex');
      if (saltedPass == user.password) {
        return C.getSiteState();
      }
      else {
        cb("Invalid username/password combination.");
      }
    }
  })
  .then(function(state) {

    var expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    var token = jwt.sign({
      username: username,
      expirationDate: expirationDate
    }, state.secret);

    cb(null, {
      success: true,
      token: token
    });
  })
  .catch(function(err) {
    cb(err);
  });
}

function register(username, password, emailAddress, cb) {

  var modelServiceLookup = {
    action: 'lookup',
    app: 'auth',
    model: 'User',
    value: username
  };
  C.invokeService('_carolina', 'ModelService', modelServiceLookup)
  .then(function(data) {
    if (data == null) {

      var salt = crypto.randomBytes(32).toString('hex');
      var saltedPass = crypto.pbkdf2Sync(password, salt,
        1000, 64, 'sha512').toString('hex');
      var modelServiceInsert = {
        action: 'create',
        app: 'auth',
        model: 'User',
        obj: {
          username: username,
          password: saltedPass,
          salt: salt,
          emailAddress: emailAddress,
          isAdmin: false
        }
      };

      return C.invokeService('_carolina', 'ModelService', modelServiceInsert);
    }
    else {
      cb("Username exists.");
    }
  })
  .then(function(data) {
    if (data.hasOwnProperty('errorMessage')) {
      cb(data.errorMessage);
    }
    else
      cb(null, { success: true });
  })
  .catch(function(err) {
    cb(err);
  });
}

function updatePassword(token, oldPassword, newPassword, cb) {
  authCheck(token)
  .then(function(user) {

    if (!user) cb("Invalid password.");
    var saltedPass = crypto.pbkdf2Sync(Buffer(oldPassword), Buffer(user.salt),
      1000, 64, 'sha512').toString('hex');
    if (saltedPass == user.password) {

      var newSalt = crypto.randomBytes(32).toString('hex');
      user.salt = newSalt;
      user.password = crypto.pbkdf2Sync(Buffer(newPassword), Buffer(newSalt),
        1000, 64, 'sha512').toString('hex');

      var modelServiceUpsert = {
        action: 'upsert',
        app: 'auth',
        model: 'User',
        obj: user
      };
      C.invokeService('_carolina', 'ModelService', modelServiceUpsert)
      .then(function(data) {
        cb(null, { success: true });
      })
      .catch(function(err) {
        cb(err);
      });
    }
    else {
      cb("Invalid password.");
    }
  })
  .catch(function(err) {
    cb(err);
  });
}

function updateProfile(token, info, cb) {
  authCheck(token)
  .then(function(user) {

    var changed = false;

    if (info.emailAddress) {

      user.emailAddress = info.emailAddress;

      changed = true;
    }
    if (info.name) {

      user.name = info.name;

      changed = true;
    }

    if (changed) {
      var modelServiceUpsert = {
        action: 'upsert',
        app: 'auth',
        model: 'User',
        obj: user
      };
      C.invokeService('_carolina', 'ModelService', modelServiceUpsert)
      .then(function(data) {
        cb(null, { success: true });
      })
      .catch(function(err) {
        cb(err);
      });
    }
    else {
      cb(null, { success: true });
    }
  })
  .catch(function(err) {
    cb(err);
  });
}

exports.handler = function(event, context, callback) {
  if (!event.action) callback("No action specified.");
  switch(event.action) {
    case 'check':
      check(event.token, callback);
      break;
    case 'forgot':
      forgot(event.username, event.emailAddress, callback);
      break;
    case 'get-user':
      getUser(event.token, callback);
      break;
    case 'login':
      login(event.username, event.password, callback);
      break;
    case 'register':
      register(event.username, event.password, event.emailAddress, callback);
      break;
    case 'update-password':
      updatePassword(event.token, event.oldPassword, event.newPassword, callback);
      break;
    case 'update-profile':
      updateProfile(event.token, event.info, callback);
      break;
    default:
      callback("Invalid action provided.");
  }
};
