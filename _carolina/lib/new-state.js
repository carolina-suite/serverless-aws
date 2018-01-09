
var generateToken = require('./generate-token');

module.exports = function() {
  return {
    corsEnabledEndpoints: [],
    createdTables: [],
    createdEndpoints: {},
    createdHttpFunctions: [],
    createdIntegrations: [],
    createdMethods: [],
    createdSvcFunctions: [],
    functionArns: {},
    permittedIntegrations: [],
    secret: generateToken(16),
    siteSuffix: generateToken(8)
  };
};
