
var crypto = require('crypto');

module.exports = function(s) {
  return crypto.randomBytes(s).toString('hex');
};
