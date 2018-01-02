
var yaml = require('yamljs');

var CarolinaLib = require('./_carolina');
var config = require('./config');

async function loadFixtures(fixtures) {

  var Carolina = new CarolinaLib(config);
  await Carolina.gatherFixtures();

  fixtures.map(async function(fixture) {
    var fixtureData = require(`./.fixtures/${fixture}`);
    fixtureData.map(async function(item) {
      await Carolina.putFixtureItem(item);
    });
  });
}

loadFixtures(process.argv.slice(2));
