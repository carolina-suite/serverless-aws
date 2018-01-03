
var generateToken = require('./generate-token');

module.exports = function() {
  return {
    createdTables: [],
    createdEndpoints: {},
    createdHttpFunctions: [],
    createdIntegrations: [],
    createdMethods: [],
    functionArns: {},
    permittedIntegrations: [],
    secret: generateToken(16),
    siteSuffix: generateToken(8)
  };
};
