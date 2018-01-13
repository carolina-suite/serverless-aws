
var path = require('path');

var fs = require('fs-extra');
var sleepPromise = require('sleep-promise');

var CarolinaLib = require('./_carolina');
var config = require('./config');

async function partialDeploy(command, app) {

  console.log(`Running command: ${command}`);

  var Carolina = new CarolinaLib(config);

  if (app) {
    Carolina.allApps = [app];
    console.log(`Using app ${app}`)
  }

  try {

    if (command == 'gather-prerender-templates')
      await Carolina.gatherPrerenderTemplates();
    if (command == 'prerender')
      await Carolina.doPrerender();
    if (command == 'copy-docusaurus')
      await Carolina.copyDocusaurus();
    if (command == 'create-http-archives')
      await Carolina.createHttpArchives();
    if (command == 'create-svc-archives')
      await Carolina.createSvcArchives();

    if (command == 'create-tables')
      await Carolina.createTables();
    if (command == 'create-master-role')
      await Carolina.createMasterRole();
    if (command == 'add-policy')
      await Carolina.addPolicyToMasterRole();
    if (command == 'create-api')
      await Carolina.createMasterAPI();

    if (command == 'create-public-bucket') {
      if (!Carolina.state.publicBucketExists) {
        await Carolina.createPublicBucket();
        var res = await Carolina.configurePublicBucket();
        console.log(res);
      }
    }
    if (command == 'create-private-bucket') {
      if (!Carolina.state.privateBucketExists) {
        await Carolina.createPrivateBucket();
      }
    }

    if (command == 'fill-public-bucket')
      await Carolina.fillPublicBucket();
    if (command == 'fill-private-bucket')
      await Carolina.fillPrivateBucket();

    if (command == 'put-http')
      await Carolina.putHttpPackages();
    if (command == 'put-svc')
      await Carolina.putSvcPackages();
    if (command == 'create-endpoints')
      await Carolina.createEndpoints();
    if (command == 'deploy-api')
      await Carolina.deployAPI();

    if (command == 'write-frontend-config')
      await Carolina.writeFrontEndConfigFile();

    // console.log(Carolina.state);
    if (command == 'put-state')
      await Carolina.putState();
  }
  catch(err) {
    console.log(err);
  }
  finally {
    await Carolina.saveState();
  }
}

if (process.argv[3])
  partialDeploy(process.argv[2], process.argv[3])
else
  partialDeploy(process.argv[2]);
