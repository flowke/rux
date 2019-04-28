
const MiniCssExtractPlugin =  require('mini-css-extract-plugin');
const env = require('../config/env.js');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;

let isEnvProduction = env.node_env === 'production';

exports.getStyleLoaders = (cssOptions, preLoader) => {
  const loaders = [
    !isEnvProduction && require.resolve('style-loader'),
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader,
      options:{},
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    preLoader
  ]
  return loaders;
};

module.exports = [
  {
    oneOf: [
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        // include: paths.appSrc,
        loader: require.resolve('babel-loader'),
        options: {
          configFile: '../config/babel.config.js'
        },
      },
      {
        test: cssRegex,
        exclude: cssModuleRegex,
        use: getStyleLoaders({
          sourceMap: isEnvProduction,
        }),
        sideEffects: true,
      },
      {
        test: cssModuleRegex,
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: isEnvProduction,
          modules: true,
        }),
      },
      {
        test: sassRegex,
        exclude: sassModuleRegex,
        use: getStyleLoaders(
          {
            sourceMap: isEnvProduction,
          },
          'sass-loader'
        ),
        sideEffects: true,
      },
      {
        test: sassModuleRegex,
        use: getStyleLoaders(
          {
            sourceMap: isEnvProduction,
            modules: true,
          },
          'sass-loader'
        ),
      },
      {
        test: lessRegex,
        exclude: lessModuleRegex,
        use: getStyleLoaders(
          {
            sourceMap: isEnvProduction,
          },
          'less-loader'
        ),
        sideEffects: true,
      },
      {
        test: lessModuleRegex,
        use: getStyleLoaders(
          {
            sourceMap: isEnvProduction,
            modules: true,
          },
          'less-loader'
        ),
      },
      {
        loader: require.resolve('file-loader'),
        exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ]
  }
]