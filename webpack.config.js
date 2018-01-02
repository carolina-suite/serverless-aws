
const path = require('path');

const fs = require('fs-extra');
const _ = require('underscore');

var config = require('./config');

const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');

var entry = {};
var srcDirs = [];
var allApps = ['_carolina', 'home'].concat(config.apps);

for (var i = 0; i < allApps.length; ++i) {
  var appName = allApps[i];
  if (fs.existsSync(`apps/${appName}/src`)) {
    srcDirs.push(path.resolve(__dirname, `apps/${appName}/src`));
  }
  if (fs.existsSync(`apps/${appName}/webpack.js`)) {
    entry = _.extend(entry, require(`./apps/${appName}/webpack`).entry);
  }
}

module.exports = {
  plugins: [
    new UglifyJsWebpackPlugin()
  ],
  entry: entry,
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'apps', 'home', 'public', 'static')
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: srcDirs,
        loader: 'babel-loader'
      }
    ]
  }
};
