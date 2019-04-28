const Config = require('webpack-chain'); 
const env = require('./env'); 
const paths = require('paths');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

let isDevMode = env.NODE_ENV === 'development';
let isProdMode = env.NODE_ENV === 'production';

let cfg = new Config();



cfg.merge({
  mode: env.NODE_ENV,
  devtool: isProdMode ? 'cheap-module-source-map' : 'source-map',
  entry: {
    app: [paths.entryPoint]
  },
  output: {
    path: paths.outputPath,
    publicPath: paths.publicPath,
    filename: isProdMode
      ? '[name].[contenthash:8].js'
      : 'bundle.js',
    chunkFilename: isEnvProduction
      ? '[name].[contenthash:8].chunk.js'
      : '[name].chunk.js',
  },
  plugin: {
    HtmlWebpackPlugin: {
      plugin: HtmlWebpackPlugin,
      args: [
        {
          template: paths.appHtml,
          ...isProdMode? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }: {}
        }
      ]
    },
    PnpWebpackPlugin: {
      plugin: PnpWebpackPlugin
    },
    DefinePlugin: {
      plugin: webpack.DefinePlugin,
      args: [
        {
          'process.env': env.stringified
        }
      ]
    },
    HotModuleReplacementPlugin: isDevMode? {
      plugin: webpack.HotModuleReplacementPlugin
    }: undefined,

    MiniCssExtractPlugin: isProdMode? {
      plugin: MiniCssExtractPlugin,
      args: [{
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }]
    }: undefined

  },

  resolveLoader: {
    plugin: {
      pnp: {
        plugin: PnpWebpackPlugin.moduleLoader,
        args: [module]
      }
    }
  }

})

module.exports = cfg;