
# Service Functions #

There are two types of Lambda functions in your site.

| Type | Location | Description |
| --- | --- | --- |
| HTTP | `apps/<appName>/http/<endpointName>/` | Interacted with by HTTP POST requests. |
| Service | `apps/<appName>/services/<serviceName>/` | Callable by the HTTP handlers. |

HTTP functions should do minimal work outside of reading the request and
formatting the response. Business logic should be in a service function.

In both cases, the code for a Lambda function must:

* Be in its own folder in the right path.
* Have an index.js file that exposes a function `handler` that takes event, context, and callback.
* Be runnable under NodeJs 6.10.
* Have all dependencies in the folder with it.

In addition to the code you provide, a file called `_carolina.js` will be
added at the root of the service folder. It contains some helpful code.

## HTTP Function Details #

An HTTP function `index.js` might look like this (note that the
`_carolina.js` file will be copied over automatically).

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

Note that `event.body` will be the object representing the POST request data.

You can use a the Carolina helper file like this (note that the
`_carolina.js` file will be copied over automatically):

```js
var C = require('./_carolina');

exports.handler = function(event, context, callback) {
  C.invokeService('_carolina', 'ModelService', { message: "This is a test." })
    .then(function(data) {
       C.sendResponse(data, callback);
    })
    .catch(function(err) {
      callback(err);
    })
};
```

In this example, the `C.invokeService(appName, serviceName, body)` is used
to call an existing Service function using Promises and the
`C.sendResponse(data, callback)` method is passed the original callback
and sends the response with JSON headers and a 200 status code.

You can use `_carolina.js` to call any service function you build and deploy
using this method.

## Service Function Details #

A service function looks something like this;

```js
exports.handler = function(event, context, callback) {

  var successValue = true;

  callback(null, {
    success: successValue,
    event: event
  });
};
```

In the case of Service lambda function, the event object is the object
passed as an argument to the function when it is called. If called using
the carolina helper library, the third argument passed to
`C.invokeService` will be the event passed to the service.

Unlike HTTP functions, the service function callback should directly
respond with the data that is the result of the function (no need
for `statusCode`, `header`, and `body`). These functions will not be accessible
by HTTP and are intended only to be called by your HTTP functions or by
other service functions themselves (don't do recursive calls tho).
