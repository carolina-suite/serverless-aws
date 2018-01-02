
var CarolinaLib = require('./_carolina');
var config = require('./config');

async function fixture(fixtureName) {

  var Carolina = new CarolinaLib(config);
  await Carolina.gatherFixtures();
}

fixture(process.argv[2]);
