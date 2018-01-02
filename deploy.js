
var path = require('path');

var fs = require('fs-extra');

var CarolinaLib = require('./_carolina');
var config = require('./config');

async function deploy() {

  var messages = [];
  var Carolina = new CarolinaLib(config);

  await Carolina.createTables();

  // create public bucket if it does not exist
  if (!Carolina.state.publicBucketExists) {
    await Carolina.createPublicBucket();
    var res = await Carolina.configurePublicBucket();
    console.log(res);
  }
  if (!Carolina.state.privateBucketExists) {
    await Carolina.createPrivateBucket();
  }
  await Carolina.fillPublicBucket();
  await Carolina.fillPrivateBucket();

  console.log(Carolina.state);
  await Carolina.putState();
  await Carolina.saveState();

  console.log(`Your site is running at:`);
  console.log(Carolina.publicUrl);
}

deploy();
