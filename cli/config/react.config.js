const config = require('./config.js');


config.module
  .rule('baseLoaders')
  .oneOf('babel')
    // .tap(op=>{
    //   return {}
    // })


console.log(
  config.module
    .rule('baseLoaders')
    .oneOf('babel')
    .get('options')
      

  );



module.exports = config;