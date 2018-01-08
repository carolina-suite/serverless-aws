
var CarolinaLib = require('./_carolina');
var config = require('./config');

async function build() {
  var Carolina = new CarolinaLib(config);
  try {
    await Carolina.gatherPrerenderTemplates();
    await Carolina.doPrerender();
    await Carolina.copyDocusaurus();
    await Carolina.createHttpArchives();
    await Carolina.createSvcArchives();
  }
  catch(err) {
    console.log(err);
  }
}

build();
