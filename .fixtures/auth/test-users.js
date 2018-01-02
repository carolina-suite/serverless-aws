
var crypto = require('crypto');

var userModel = {
  app: 'auth', model: 'User'
};
var users = [
  {
    fields: {
      username: 'admin',
      password: 'admin123',
      isAdmin: true
    }
  },
  {
    fields: {
      username: 'applejack',
      password: 'orange',
      isAdmin: false
    }
  },
  {
    fields: {
      username: 'pinkiePie',
      password: 'pink',
      isAdmin: false
    }
  },
  {
    fields: {
      username: 'rarity',
      password: 'white',
      isAdmin: false
    }
  },
  {
    fields: {
      username: 'twilightSparkle',
      password: 'purple',
      isAdmin: false
    }
  },
  {
    fields: {
      username: 'rainbowDash',
      password: 'blue',
      isAdmin: false
    }
  },
  {
    fields: {
      username: 'fluttershy',
      password: 'yellow',
      isAdmin: false
    }
  }
];

for (var i = 0; i < users.length; ++i) {
  users[i].fields.salt = crypto.randomBytes(32).toString('hex');
  users[i].password = crypto.pbkdf2Sync(users[i].fields.password, users[i].fields.salt,
    1000, 64, 'sha512').toString('hex');
  users[i].model = userModel;
}

module.exports = users;
