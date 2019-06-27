const webpack = require('webpack');
const rimraf = require('rimraf');
const creageOP = require('../config/options');
const fs = require('fs');
module.exports = function(cb){
  let config = require('../config/vue.config.js').toConfig();
  
  rimraf.sync(creageOP().paths.outputPath+ '/*')

  webpack(config,(err, stats)=>{
    // if (err) {
    //   console.error(err.stack || err);
    //   if (err.details) {
    //     console.error(err.details);
    //   }
    //   return;
    // }

    // const info = stats.toJson();

    // if (stats.hasErrors()) {
    //   console.error(info.errors);
    // }

    // if (stats.hasWarnings()) {
    //   console.warn(info.warnings);
    // }

    if(cb){
      cb(err, stats)
    }else{
      if (!err) {
        console.log(stats.toString({
          colors: true
        }))
      }
    }


  })
}