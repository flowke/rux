const Config = require('webpack-chain');
const env = require('./env');
const path = require('path');
const PnpWebpackPlugin = require('./plugin/pnp');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const babelConfig = require('./babel.config');
const WebpackBuildNotifierPlugin = require('./plugin/notifier');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ora = require('ora');
const chalk = require('chalk');
const type = require('../../utils/type');

const options = require('./options')();

let {
  clientEnv,
  globalVar,
  paths,
  compatibility,
  multiPages,
  splitRuntime
} = options;


let isDevMode = clientEnv.NODE_ENV === 'development';
let isProdMode = clientEnv.NODE_ENV === 'production';

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;

let {
  assetsDir,
  hash,
  contentHash,
  js,
  css,
  fonts,
  img,
  media,
  otherFiles,
  patterns
} = paths

// filenames



assetsDir = assetsDir === null ? '' : assetsDir
assetsDir = assetsDir.replace(/^\//, '')
assetsDir = assetsDir.replace(/\/$/, '')
if (assetsDir) assetsDir = assetsDir + '/'

let hashPattern = rt(() => {

  if (contentHash === true) return '[contenthash:8]';

  if (contentHash && type(contentHash, 'string')) return contentHash;

  if (hash === true) return '[hash:8]'
  if (hash && type(hash, 'string')) return hash

  if (contentHash === false) return ''

  return '[contenthash:8]'

})

let fileHash = hashPattern ? '[hash:8]' : '';

let jsPath = js || `${assetsDir}js/[name].${hashPattern}`;
jsPath = jsPath.replace(/(\.|\.js)$/, '')

let cssPath = css || `${assetsDir}css/[name].${hashPattern}`;
cssPath = cssPath.replace(/(\.|\.css)$/, '')

let fontsPath = fonts || `${assetsDir}fonts/[name].${fileHash}`;
fontsPath = fontsPath.replace(/(\.|(\.\[ext\]))$/, '')
fontsPath += '.[ext]'

let imgPath = img || `${assetsDir}img/[name].${fileHash}`;
imgPath = imgPath.replace(/(\.|(\.\[ext\]))$/, '')
imgPath += '.[ext]'

let mediaPath = media || `${assetsDir}media/[name].${fileHash}`;
mediaPath = mediaPath.replace(/(\.|(\.\[ext\]))$/, '')
mediaPath += '.[ext]'

let otherPath = otherFiles || `${assetsDir}other-files/[name].${fileHash}`;
otherPath = otherPath.replace(/(\.|(\.\[ext\]))$/, '')
otherPath += '.[ext]'

function rt(cb) {
  return cb && cb()
}

let getStyleLoaders = (cssOptions, preLoader = {}) => {
  let loaders = {
    ...!isProdMode ? {
      styleLoader: {
        loader: require.resolve('style-loader')
      }
    } : {},

    ...isProdMode ? {
      nimiCss: {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: () => {
            let pos = path.resolve(paths.outputPath, cssPath.replace(/\/[^/]*$/, '/x.x'));

            let op = paths.outputPath.replace(/.$/, (m) => {
              if (m !== '/') m = `${m}/`
              return m
            })

            return path.relative(pos, op).replace(/.$/, (m) => {
              if (m !== '/') m = `${m}/`
              return m
            })
          }
        },
      }
    } : {},
    cssLoader: {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    ...preLoader
  }

  return loaders;
};

let cfg = new Config();

cfg.merge({
  mode: clientEnv.NODE_ENV,
  devtool: isProdMode ? 'cheap-module-source-map' : 'source-map',
  entry: {
    app: [paths.entryPoint]
  },
  target: options.target,
  output: {
    path: paths.outputPath,
    publicPath: paths.publicPath,
    filename: isProdMode
      ? jsPath + '.js'
      : 'bundle.js',
    // chunkFilename: isProdMode
    //   ? jsPath+'.[id].chunk.js'
    //   : '[name].chunk.js',
  },

  resolve: {
    alias: {
      '@': path.resolve(options.appRoot, 'src'),
      '@@': path.resolve(options.appRoot),
    },
    extensions: [
      '.js', '.vue', '.json'
    ]
  },

  module: {
    rule: {
      // name: baseLoader
      baseLoaders: {

        oneOf: {
          // name: image, 
          image: {
            test: /\.(bmp|gif|jpe?g|png|svg)$/,
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: imgPath
            },
          },
          fonts: {
            test: /\.(ttf|eot|woff|woff2)$/,
            loader: require.resolve('file-loader'),
            options: {
              name: fontsPath
            },
          },
          media: {
            test: /\.(mp3|ogg|wav|avi|mpeg|mov|mkv|wmv|flv|rmvb|webm|mp4)$/,
            loader: require.resolve('file-loader'),
            options: {
              name: mediaPath
            },
          },

          // name: babel
          // only handle app src js
          js: {
            test: /\.(js)$/,
            include: [paths.appSrc, /puta\/lib\/index/],
            use: {
              'babel': {
                loader: require.resolve('babel-loader'),
                options: babelConfig({
                  compatibility
                }),
              }
            },

          },
          // name: css
          css: {
            test: cssRegex,
            exclude: [cssModuleRegex],
            use: getStyleLoaders({
              sourceMap: isProdMode,
            }),
            sideEffects: true,
          },
          // name: cssModule
          cssMosule: {
            test: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: isProdMode,
              modules: true,
            }),
          },
          // name: sass
          sass: {
            test: sassRegex,
            exclude: [sassModuleRegex],
            use: getStyleLoaders(
              {
                sourceMap: isProdMode,
              },
              {
                sassLoader: {
                  loader: require.resolve('sass-loader')
                }
              }
            ),
            sideEffects: true,
          },
          // sassModule
          sassModule: {
            test: sassModuleRegex,
            use: getStyleLoaders(
              {
                sourceMap: isProdMode,
                modules: true,
              },
              {
                sassLoader: {
                  loader: require.resolve('sass-loader')
                }
              }
            ),
            sideEffects: true,
          },
          // name: less
          less: {
            test: lessRegex,
            exclude: [lessModuleRegex],
            use: getStyleLoaders(
              {
                sourceMap: isProdMode,
              },
              {
                lessLoader: {
                  loader: require.resolve('less-loader')
                }
              }
            ),
            sideEffects: true,
          },
          // lessLoader
          lessModule: {
            test: lessModuleRegex,
            use: getStyleLoaders(
              {
                sourceMap: isProdMode,
                modules: true,
              },
              {
                lessLoader: {
                  loader: require.resolve('less-loader')
                }
              }
            ),
          },
          // name: fileCallBack
          fileCallBack: {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: otherPath,

            },
          }
        }
      }
    }
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      automaticNameDelimiter: '.',
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        }
      }
    }
  },

  plugin: {
    HtmlWebpackPlugin: {
      plugin: HtmlWebpackPlugin,
      args: [
        {
          template: paths.appHtml,
          ...isProdMode ? {
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
          } : {}
        }
      ]
    },
    PnpWebpackPlugin: {
      plugin: PnpWebpackPlugin
    },
    DefinePlugin: {
      plugin: webpack.DefinePlugin,
      args: [env.stringified(globalVar)]
    },
    EnvironmentPlugin: {
      plugin: webpack.EnvironmentPlugin,
      args: [env.stringified(clientEnv)]
    },
    ...isDevMode ? {
      HotModuleReplacementPlugin: {
        plugin: webpack.HotModuleReplacementPlugin
      }
    } : {},

    FriendlyErrorsWebpackPlugin: {
      plugin: FriendlyErrorsWebpackPlugin
    },
    ProgressPlugin: {
      plugin: function () {
        let span = ora({ spinner: 'point' });
        let hasStart = false;
        return new webpack.ProgressPlugin((percent, msg) => {
          let fixed = chalk.bold.green(`${(percent * 100).toFixed()}%`)

          if (percent == 1 || msg === 'after emitting') {
            span.stop()
            span.clear()
            return;
          }

          if (hasStart) {
            span.text = fixed
          } else {
            hasStart = true;
            span.start(fixed)
          }

        })
      }
    },


  },

  resolveLoader: {
    plugin: {
      pnp: {
        plugin: PnpWebpackPlugin.ruxModuleLoader,
        args: [module]
      }
    }
  }

})

if (isProdMode) {
  cfg.merge({
    plugin: {
      MiniCssExtractPlugin: {
        plugin: MiniCssExtractPlugin,
        args: [{
          filename: cssPath + '.css',
          chunkFilename: cssPath + '.[id].chunk.css',
        }]
      },
      HashedModuleIdsPlugin: {
        plugin: webpack.HashedModuleIdsPlugin,
      }
    }
  })
}

// add plugin

if (splitRuntime === true) {
  cfg.optimization
    .runtimeChunk('single')
}

if (multiPages === true) {
  // 不等于 false 就split
  if (typeof splitRuntime !== 'boolean') {
    cfg.optimization
      .runtimeChunk('single')
  }

}

patterns.forEach((item, i) => {

  let test = [];

  if (type(item[0], 'array')) {
    test = test.concat(item[0])
  } else {
    test.push(item[0])
  }

  cfg.module.rule('baseLoaders').oneOf(i)
    .test(test)
    .use('file')
    .loader(require.resolve('file-loader'))
    .options({
      name: item[1]
    })
    .end()
    .before('fileCallBack')


})


class Inject {
  constructor() {
    this.before = [];
    this.post = [];
    this.injection = [];
  }

  add(cb, flag = 'injection') {
    let cachingArr = this.injection;
    if (flag === 'before') cachingArr = this.before;
    if (flag === 'post') cachingArr = this.post;

    cb && cachingArr.push(cb)
  }

  getCaching() {
    return this.before.concat(this.injection, this.post)
  }

}

let injection = new Inject

// the exports

function create() {
  injection.getCaching().forEach(e => {

    e(cfg)
  })

  return cfg.toConfig()
}

create.add = injection.add.bind(injection)
create.config = cfg

create.html = {
  add: (name, op = {}) => {

    injection.add(chain => {
      chain.plugin(name)
        .use(HtmlWebpackPlugin, [{
          template: paths.appHtml,
          ...isProdMode ? {
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
            // minify: false
          } : {},
          ...op
        }])
    })

  },
}

module.exports = create;