const config = require('./config.js');
const merge = require('../../internal/mergeDeep');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const wpkMerge = require('webpack-merge');
const type = require('../../utils/type');

const options = require('./options')();

config.module
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

config.merge({
  plugin: {
    VueLoaderPlugin: {
      plugin: VueLoaderPlugin
    }
  }
})

options.webpackChain(config);

let cfg = config.toConfig();

if(type(options.webpack, 'object')){
  cfg = wpkMerge(cfg, options.webpack)
}

if(type(options.webpack, 'function')){
  let out = options.webpack(config, wpkMerge)

  if(type(out, 'object')) cfg = out;
}

module.exports = cfg;