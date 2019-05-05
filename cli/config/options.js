const validator = require('../lib/utils/validator');
const _ = require('lodash');
const fse = require('fs-extra');
const path = require('path');
const paths = require('./paths')

let schema = {
  type: 'object',
  properties: {
    devServer:{type: 'object'},
    clientEnv: {
      type: 'object',
      patternProperties: {
        '.*': {type: 'string'}
      }
    },
    paths: {
      type: 'object',
      '.*': { type: 'string' }
    },
    appRoot: {
      type: 'string',
      absolutePath: true,
      errorMessage: 'appRoot should be absolute path'
    }
  }
}

let defaultOptions = {
  devServer: {
    port: 3005,
    quiet: true,
  },
  appRoot: process.cwd(),
  paths,
}

function getUserOptions() {
  let options = {};

  let configPath = path.resolve('./config/config.js');

  if (fse.existsSync(configPath)) {
    options = require(configPath);
  }
  return options;
}


 function createOptions(){
  
  let userOp = getUserOptions();

  validator(schema, userOp , err=>{
    console.log(err);
    
    if (err) throw new Error(`config ${err.dataPath} ${err.message}`);
  });

  let ruxOp = _.defaultsDeep(userOp, defaultOptions);
  validator(schema, ruxOp);
  
  return ruxOp;

}

module.exports = createOptions();