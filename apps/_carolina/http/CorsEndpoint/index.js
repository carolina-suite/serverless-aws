
var C = require('./_carolina');

exports.handler = function(event, context, callback) {
  callback(null, {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  });
};
