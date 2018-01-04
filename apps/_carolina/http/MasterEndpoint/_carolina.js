
var aws = require('aws-sdk');

var lambda = new aws.Lambda();

this.getSvcPrefix = function() {
  var p = process.env.svcPrefix;
  if (!p.endsWith('_')) p = p + '_';
  return p;
};

this.invokeService = function(app, service, args) {

  var params = {
    FunctionName: this.getSvcPrefix() + app + '_' + service,
    Payload: JSON.stringify(args)
  };

  return new Promise(function(resolve, reject) {
    lambda.invoke(params, function(err, data) {
      if (err) reject(err);
      else resolve(data.Payload);
    });
  });
};

this.sendResponse = function(res, cb) {
  cb(null, {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(res)
  });
};
