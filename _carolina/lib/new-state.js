
var generateToken = require('./generate-token');

module.exports = function() {
  return {
    secret: generateToken(16),
    siteSuffix: generateToken(8)
  };
};
