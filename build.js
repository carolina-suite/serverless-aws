
var CarolinaLib = require('./_carolina');
var config = require('./config');

async function build() {
  var Carolina = new CarolinaLib(config);
  await Carolina.gatherPrerenderTemplates();
  await Carolina.doPrerender();
  await Carolina.createHttpArchives();
  await Carolina.createSvcArchives();
}

build();
