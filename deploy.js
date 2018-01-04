
var path = require('path');

var fs = require('fs-extra');
var sleepPromise = require('sleep-promise');

var CarolinaLib = require('./_carolina');
var config = require('./config');

async function deploy() {

  var messages = [];
  var Carolina = new CarolinaLib(config);

  // create DynamoDB tables
  await Carolina.createTables();
  // create IAM role and add admin policy
  await Carolina.createMasterRole();
  await Carolina.addPolicyToMasterRole();
  // create APIGateway API
  await Carolina.createMasterAPI();

  // allow some things to populate before proceding
  await sleepPromise(5000);

  // create public bucket if it does not exist
  if (!Carolina.state.publicBucketExists) {
    await Carolina.createPublicBucket();
    var res = await Carolina.configurePublicBucket();
    console.log(res);
  }
  if (!Carolina.state.privateBucketExists) {
    await Carolina.createPrivateBucket();
  }

  // fill S3 buckets
  await Carolina.fillPublicBucket();
  await Carolina.fillPrivateBucket();

  // create/update Lambda functions
  await Carolina.putHttpPackages();
  await Carolina.putSvcPackages();
  // create/update APIGateway Endpoints
  await Carolina.createEndpoints();
  // deploy api
  await Carolina.deployAPI();

  console.log(Carolina.state);
  await Carolina.putState();
  await Carolina.saveState();

  console.log(`Your site is running at:`);
  console.log(Carolina.publicUrl);
}

deploy();
