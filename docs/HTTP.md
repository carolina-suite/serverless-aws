
# HTTP Endpoints #

Each HTTP endpoint should go in a folder called
`apps/<appName>/http/<endpointName>/`.

That entire contents of the folder will be bundled and set up as an
AWS Lambda function that will publically callable via POST request at
`https://<apiGatewayUrl>/api/<appName>_<endpointName>`.

## Format #

The endpoint directory should contain an `index.js` file that exports
a function called `handler` that looks like this:

```js
exports.handler = function(event, context, callback) {
  callback(null, {
    statusCode: 200,
    headers: {},
    body: JSON.stringify({
      // some object
    })
  });
};
```

Any POST data to the server should be in JSON format and will be available
to the handler function as `event.body`. The callback should provide
as a second argument an object with `statusCode` (the HTTP status to send back),
`headers` an object of HTTP header values, and `body` (a string that will
be the response body).

## Dependencies #

All code must be executable by NodeJs 6.10 (the latest node version
supported on AWS Lambda).

ALL dependencies of the code (including `node_modules` from npm) MUST
be included in the folder for that endpoint. The entire folder will be
zipped and sent to your site's private S3 Bucket and opened to a Lambda function.

You will not need to know the API Gateway Url, a front end Javascript
config file will be generated that has the URL stored as a variable.
