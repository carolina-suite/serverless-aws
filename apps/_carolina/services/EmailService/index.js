
var C = require('./_carolina');

var AWS = require('aws-sdk');
var ses = new AWS.SES();

function sendEmail(to, bcc, from, subject, body, cb) {
  var params = {
    Destination: {
      BccAddresses: bcc,
      ToAddresses: to
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: from
  };
  ses.sendEmail(params, function(err, data) {
    if (err) cb(err);
    else cb(null, data);
  });
}

exports.handler = function(event, context, callback) {
  if (!event.action) callback("No action specified.");
  switch(event.action) {
    case 'send-email':
      if (!event.bcc) event.bcc = [];
      sendEmail(event.to, event.bcc, event.from, event.subject, event.body, callback);
      break;
    default:
      callback("Invalid action provided.");
  }
};
