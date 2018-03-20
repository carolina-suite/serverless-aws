
var vorpal = require('vorpal')();

var CarolinaLib = require('./_carolina');
var config = require('./config');

var Carolina = new CarolinaLib(config);

var prerenderTemplatesCommand = vorpal.command('prerender-templates', "Gathers all prerender templates.");
prerenderTemplatesCommand.action((args, cb) => {
  Carolina.gatherPrerenderTemplates()
    .then(() => { Carolina.saveState(); })
    .then(() => { cb() });
});

var prerenderCommand = vorpal.command('prerender', "Prerenders static files.");
prerenderCommand.action((args, cb) => {
  Carolina.doPrerender()
  .then(() => { Carolina.saveState(); })
  .then(() => { cb() });
});

var docusaurusCommand = vorpal.command('docusaurus', "Copies all docusaurus builds.");
docusaurusCommand.action((args, cb) => {
  Carolina.copyDocusaurus()
  .then(() => { Carolina.saveState(); })
  .then(() => { cb() });
});

var createHttpCommand = vorpal.command('create-http', "Creates .zip files for HTTP endpoints.");
createHttpCommand.action((args, cb) => {
  Carolina.createHttpArchives()
  .then(() => { Carolina.saveState(); })
  .then(() => { cb() });
});

var createSvcCommand = vorpal.command('create-svc', "Creates .zip files for all Service functions.");
createSvcCommand.action((args, cb) => {
  Carolina.createSvcArchives()
  .then(() => { Carolina.saveState(); })
  .then(() => { cb() });
});

var createTablesCommand = vorpal.command('create-tables', "Creates DynamoDB tables for all apps.");
createTablesCommand.alias('tables');
createTablesCommand.action((args, cb) => {
  Carolina.createTables()
  .then(() => { Carolina.saveState(); })
  .then(() => { cb() });
});

var createMasterRoleCommand = vorpal.command('create-master-role', "Creates a master IAM role.");
createMasterRoleCommand.alias('master-role');
createMasterRoleCommand.alias('role');
createMasterRoleCommand.action((args, cb) => {
  Carolina.createMasterRole()
  .then(() => { Carolina.saveState(); })
  .then(() => { cb() });
});

var addPolicyToMasterRoleCommand = vorpal.command('add-policy', "Adds the standard policy to master IAM role.");
addPolicyToMasterRoleCommand.alias('policy');
addPolicyToMasterRoleCommand.action((args, cb) => {
  Carolina.addPolicyToMasterRole()
  .then(() => { Carolina.saveState(); })
  .then(() => { cb() });
});

var createMasterAPICommand = vorpal.command('create-api', "Creates the API Gateway API.");
createMasterAPICommand.alias('api');
createMasterAPICommand.action((args, cb) => {
  Carolina.createMasterAPI()
  .then(() => { Carolina.saveState(); })
  .then(() => { cb() });
});

var createPublicBucketCommand = vorpal.command('create-public-bucket', "Creates the public S3 Bucket.");
createPublicBucketCommand.alias('public-bucket');
createPublicBucketCommand.action((args, cb) => {
  Carolina.createPublicBucket()
  .then(() => { Carolina.saveState(); })
  .then(() => { cb() });
});

var configurePublicBucketCommand = vorpal.command('configure-public-bucket', "Configures the public S3 Bucket for public access.");
configurePublicBucketCommand.alias('configure-public');
configurePublicBucketCommand.alias('config-public');
configurePublicBucketCommand.action((args, cb) => {
  Carolina.configurePublicBucket()
  .then(() => { Carolina.saveState(); })
  .then(() => { cb() });
});

var createPrivateBucketCommand = vorpal.command('create-private-bucket', "Creates the private S3 Bucket.");
createPrivateBucketCommand.alias('private-bucket');
createPrivateBucketCommand.action((args, cb) => {
  Carolina.createPrivateBucket()
  .then(() => { Carolina.saveState(); })
  .then(() => { cb() });
});

var fillPublicBucketCommand = vorpal.command('fill-public-bucket', "Places public files in the public S3 Bucket.");
fillPublicBucketCommand.alias('public');
fillPublicBucketCommand.action((args, cb) => {
  Carolina.fillPublicBucket()
  .then(() => { Carolina.saveState(); })
  .then(() => { cb() });
});

var fillPrivateBucketCommand = vorpal.command('fill-private-bucket', "Places private files and archives in the private S3 Bucket.");
fillPrivateBucketCommand.alias('private');
fillPrivateBucketCommand.action((args, cb) => {
  Carolina.fillPrivateBucket()
  .then(() => { Carolina.saveState(); })
  .then(() => { cb() });
});

var putHttpCommand = vorpal.command('put-http', "Creates/updates HTTP endpoint Lambda functions.");
putHttpCommand.alias('http');
putHttpCommand.action((args, cb) => {
  Carolina.putHttpPackages()
  .then(() => { Carolina.saveState(); })
  .then(() => { cb() });
});

var putSvcCommand = vorpal.command('put-svc', "Creates/updates service Lambda functions.");
putSvcCommand.alias('svc');
putSvcCommand.action((args, cb) => {
  Carolina.putSvcPackages()
  .then(() => { Carolina.saveState(); })
  .then(() => { cb() });
});

var createEndpointsCommand = vorpal.command('create-endpoints', "Creates/updates API Gateway endpoints.");
createEndpointsCommand.alias('endpoints');
createEndpointsCommand.action((args, cb) => {
  Carolina.createEndpoints()
  .then(() => { Carolina.saveState(); })
  .then(() => { cb() });
});

var deployAPICommand = vorpal.command('deploy-api', "Deploys latest version of API Gateway API.");
deployAPICommand.action((args, cb) => {
  Carolina.deployAPI()
  .then(() => { Carolina.saveState(); })
  .then(() => { cb() });
});

var frontendConfigCommand = vorpal.command('frontend-config', "Creates the frontend config file.");
frontendConfigCommand.action((args, cb) => {
  Carolina.writeFrontEndConfigFile()
  .then(() => { Carolina.saveState(); })
  .then(() => { cb() });
});

var fixtureCommand = vorpal.command('fixture <fixtures...>', "Uploads a fixture to the database.");
fixtureCommand.action(async (args, cb) => {
  args.fixtures.map(async function(fixture) {
    var fixtureData = require(`./.fixtures/${fixture}`);
    fixtureData.map(async function(item) {
      var res = await Carolina.putFixtureItem(item);
    });
  });
});




var putStateCommand = vorpal.command('put-state', "Puts the latest state in the private S3 Bucket.");
putStateCommand.action((args, cb) => {
  Carolina.putState()
  .then(() => { Carolina.saveState(); })
  .then(() => { cb() });
});

var showUrlCommand = vorpal.command('show-url', "Displays the URL of the project.");
showUrlCommand.alias('url');
showUrlCommand.action((args, cb) => {
  console.log(`Site running at ${Carolina.publicUrl}`);
  cb();
});

vorpal.delimiter('carolina$').show();
