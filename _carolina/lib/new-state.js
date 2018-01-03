
var generateToken = require('./generate-token');

module.exports = function() {
  return {
    createdTables: [],
    createdHttpFunctions: [],
    secret: generateToken(16),
    siteSuffix: generateToken(8)
  };
};
