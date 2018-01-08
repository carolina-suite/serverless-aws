
var C = require('./_carolina');

var heml = require('heml');
var nunjucks = require('nunjucks');

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

function sendEmailTemplate(app, template, data, to, bcc, from, cb) {
  C.getPrivateFile(app, `heml/${template}.heml`, true)
  .then(function(t) {

    var hemlString = nunjucks.renderString(t, data);
    heml(hemlString).
    then(function(hemlOutput) {
      var params = {
        Destination: {
          BccAddresses: bcc,
          ToAddresses: to
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: hemlOutput.html
            }
          },
          Subject: {
            Charset: 'UTF-8',
            Data: hemlOutput.metadata.subject
          }
        },
        Source: from
      };
      ses.sendEmail(params, function(err, data) {
        if (err) cb(err);
        else cb(null, data);
      });
    })
    .catch(function(err) {
      cb(err);
    });
  })
  .catch(function(err) {
    cb(err);
  });
}

exports.handler = function(event, context, callback) {
  if (!event.action) callback("No action specified.");
  switch(event.action) {
    case 'send-email':
      if (!event.bcc) event.bcc = [];
      sendEmail(event.to, event.bcc, event.from, event.subject, event.body, callback);
      break;
    case 'send-email-template':
      sendEmailTemplate(event.app, event.template, event.data, event.to, event.bcc, event.from, callback);
      break;
    default:
      callback("Invalid action provided.");
  }
};
