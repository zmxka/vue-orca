'use strict';
const path = require('path');
const utils = require('./utils');
const config = require('../config');
const vuxLoader = require('vux-loader');
const vueLoaderConfig = require('./vue-loader.conf');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const webpackConfig  = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
    libraryTarget: "var"
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', 'less'],
    alias: {
      // 'vue': 'vue/dist/vue.js',
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      '/api': resolve('src/api'),
      '/assets': resolve('src/assets'),
      '/common': resolve('src/common'),
      '/components': resolve('src/components'),
      '/views': resolve('src/views'),
      '/utils': resolve('src/utils'),
      '/static': resolve('static'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.css$/,
        include: [/src/, '/node_modules/mint-ui/lib/'],
        use: [
          {loader: "style-loader"},
          {loader: "css-loader"},
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // that does not make sense for the client
    dgram: 'empty',
    // prevent webpack from injecting mocks to Node native modules
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  // externals: {
  //   'AMap': 'window.AMap',
  //   'AMapUI': 'window.AMapUI',
  // }
};

let lessTheme = {
  name: 'less-theme',
  path: 'src/assets/style/theme.less'
};

module.exports = vuxLoader.merge(webpackConfig, {
  plugins: ['vux-ui', lessTheme]
});
