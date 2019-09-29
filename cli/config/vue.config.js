const config = require('./config.js');
const merge = require('../../internal/mergeDeep');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const wpkMerge = require('webpack-merge');
const type = require('../../utils/type');

const options = require('./options')();

config.config.module
  .rule('handleRouter')
    .pre()
  .test(/router\/index\.js$/)
    .use('router')
      .loader(require.resolve('./loader/vue-router-loader.js'))
      .end()
    .end()
  .rule('baseLoaders')
    .oneOf('js')
      .include
        .add(/\.entry\.js$/)
        .add(/\.temp\/\..+\.js$/)

        .end()
      .use('babel')
        .tap(op => {
          return merge(op, {
            plugins: [
              "babel-plugin-transform-vue-jsx"
            ]
          })
        })
        .end()
      .end()
    .exclude
      .add(/\.vue$/)
      .end()
    .end()
  .rule('vue')
    .test(/\.vue$/)
    .use('vueLoader')
      .loader(require.resolve('vue-loader'))

config.config.merge({
  plugin: {
    VueLoaderPlugin: {
      plugin: VueLoaderPlugin
    }
  }
})

if (options.webpackChain) config.add(options.webpackChain)


let cfg = config();

if(type(options.webpack, 'object')){
  cfg = wpkMerge(cfg, options.webpack)
}

if(type(options.webpack, 'function')){
  let out = options.webpack(cfg, wpkMerge)

  if(type(out, 'object')) cfg = out;
}

// console.log(cfg.module.rules[0].oneOf, 'entry');
// console.log(cfg.plugins, 'entry');


module.exports = cfg;