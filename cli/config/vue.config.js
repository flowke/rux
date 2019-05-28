const config = require('./config.js');
const merge = require('../../internal/mergeDeep');
const VueLoaderPlugin = require('vue-loader/lib/plugin');


config.module
  .rule('baseLoaders')
    .oneOf('js')
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

module.exports = config;