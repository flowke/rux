const validator = require('../lib/utils/validator');
const _ = require('lodash');
const fse = require('fs-extra');
const path = require('path');
const paths = require('./paths');
const envs = require('./env');
const chalk = require('chalk');

let schema = {
  type: 'object',
  "additionalProperties": false,
  errorMessage: {
    type: 'config must be a object.',
    additionalProperties: 'config can not contain additional properties.'

  },
  properties: {
    devServer:{
      type: 'object'
    },
    clientEnv: {
      type: 'object',
      patternProperties: {
        '.*': {type: 'string', errorMessage: 'clientEnv value should be string'}
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
    },
    globalVar: {
      type: 'object',
      // 全局变量需要大写
      propertyNames: {
        pattern: "^[A-z_][A-Z0-9_]*$",
        errorMessage: {
          pattern: 'each key of globalVar should be uppercase.'
        }
      }

    }
  }
}

let defaultOptions = {
  devServer: {
    port: 3005,
    quiet: true,
    host: '0.0.0.0',
  },
  appRoot: process.cwd(),
  paths: paths,
  clientEnv: envs.row,
  // 定义全局变量
  globalVar: {},
}

function getUserOptions() {
  let options = {};

  let configPath = path.resolve('./config/config.js');

  if (fse.existsSync(configPath)) {
    options = require(configPath);
  }
  return options;
}

// 处理路径
function handlePaths(cwd, paths={}) {

  // 来着paths.js
  let filter = [
    'publicPath'
  ];

  for (const name in paths) {
    if (paths.hasOwnProperty(name) && !path.isAbsolute(paths[name]) && !filter.some(e => e === name) ) {
      paths[name] = path.resolve(cwd, paths[name]);
    }
  }

  return paths;
}

function handleGlobalVar(vars) {
  let out = {};
  for (const name in vars) {
    if (vars.hasOwnProperty(name)) {
      out['RUX_'+name] = vars[name];
    }
  }
  return out;
}

function createOptions(){
  
  let userOp = getUserOptions();

  validator(schema, userOp , err=>{
    
    if (err) {

      
      let key = err.params.errors[0].params.additionalProperty;
      throw new Error(err.message + chalk.bold.red(` property: ${key}`));
    }
  });

  let ruxOp = _.defaultsDeep(userOp, defaultOptions);
  validator(schema, ruxOp);

  ruxOp.paths = handlePaths(ruxOp.appRoot, ruxOp.paths);
  ruxOp.globalVar = handleGlobalVar(ruxOp.globalVar);

  validator(schema, ruxOp);
  
  return ruxOp;
}

module.exports = createOptions;