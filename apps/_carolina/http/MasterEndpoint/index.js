
exports.handler = function(event, context, callback) {
  callback(null, {
    statusCode: 200,
    headers: {},
    body: JSON.stringify([ event, context ]);
  });
};
