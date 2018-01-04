
exports.handler = function(event, context, callback) {

  var successValue = true;

  callback(null, {
    success: successValue,
    event: event
  });
};
