const config = require('./config');
const merge = require('../../internal/mergeDeep');

config.module
  .rule('baseLoaders')
  .oneOf('js')
  .use('babel')
  .tap(op=>{
    return merge(op, {
      presets: [
        "@babel/preset-react"
      ]
    })

  })


module.exports = config;