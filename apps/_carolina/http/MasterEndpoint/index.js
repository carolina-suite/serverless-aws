
exports.handler = function(event, context, callback) {
  callback(null, {
    event: event,
    context: context
  });
};
