const create = require('./createEntry');
const fse = require('fs-extra');
const createOption = require('../../cli/config/options');
const path = require('path');


module.exports = (cb)=>{
  let config = {
    entry: createOption().showEntry ? path.resolve(createOption().appRoot, '.temp/.entry.js') : path.resolve(__dirname, '../../', '.temp/.entry.js')
  }

  createOption.inject({
    paths: {
      entryPoint: config.entry
    }
  });

  return new Promise((rv)=>{
    fse.outputFile(config.entry, create().code, err => {
      if (err) throw err;
      rv();
      cb && cb()
      
    })
  })

  

}