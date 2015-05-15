/* eslint-disable comma-dangle */
"use strict";

var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer-core');
var nested = require('postcss-nested');
var simpleVars = require('postcss-simple-vars');

var PRODUCTION = (process.env.NODE_ENV === 'production');

var plugins = [];
plugins.push(new webpack.DefinePlugin({
  __BROWSER__: true,
}));

var babelLoader = [
  'babel-loader?stage=1&optional[]=runtime'
];

if (PRODUCTION) {
  plugins.push(new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify("production")
    }
  }));
  plugins.push(new webpack.optimize.DedupePlugin());

  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: true,
    mangle: true,
    sourceMap: true
  }));
}

module.exports = {
  cache: true,
  debug: !PRODUCTION,
  devtool: PRODUCTION ? 'source-map' : 'eval-source-map',
  context: __dirname,
  entry: path.resolve('./cinch/static/js/src/index.jsx'),
  output: {
    path: path.resolve('./cinch/static/js/build/'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx|.js$/,
        exclude: /node_modules\//,
        loaders: babelLoader
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader!postcss-loader"
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  externals: {},
  node: {
    fs: "empty",
    net: "empty"
  },
  plugins: plugins,
  postcss: [nested, simpleVars, autoprefixer]
};
