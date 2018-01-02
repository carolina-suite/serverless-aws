
# Webpack #

If you want to create webpack bundles, create a `webpack.js` in the root of
the app. It should expose an `entry` object that maps "names" to paths to
entry points. The entry points should all be in your app's src directory.

Example (from the auth app):

```js
// apps/auth/webpack.js
this.entry = {
  'auth': './apps/auth/src/App.js'
};
```

This configuration will result in the output file:

`apps/home/public/static/js/auth.js`

To actually run webpack, install webpack globally (`npm i -g webpack`) and
run `webpack` from the project root. The `webpack.config.js` file is already
configured to look for entry points in your apps. Because the webpack root
is the project root, frontend code can import files from other apps
(but all frontend files should be in `src` dirs).
