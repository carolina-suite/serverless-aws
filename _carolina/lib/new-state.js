
var generateToken = require('./generate-token');

module.exports = function() {
  return {
    createdTables: [],
    createdEndpoints: {},
    createdHttpFunctions: [],
    createdIntegrations: [],
    createdMethods: [],
    functionArns: {},
    secret: generateToken(16),
    siteSuffix: generateToken(8)
  };
};
