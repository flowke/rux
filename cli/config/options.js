const validator = require('../lib/utils/validator');
const _ = require('lodash');
const fse = require('fs-extra');
const path = require('path');
const paths = require('./paths');
const envs = require('./env');
const chalk = require('chalk');
const debounce = require('../../utils/debounce');

let schema = {
  type: 'object',
  // "additionalProperties": false,
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
      'entryPoint': { type: 'string' },
      'outputPath': { type: 'string' },
      'publicPath': { type: 'string' },
      'appHtml': { type: 'string' },
      'appSrc': { type: 'string' },
      'assetsDir': { type: ['string', 'null'] },
      'js': { type: ['string', 'array'] },
      'css': { type: ['string', 'array'] },
      'fonts': { type: ['string', 'array'] },
      'img': { type: ['string', 'array'] },
      'otherFiles': { type: ['string', 'array'] },
      'patterns': { type: 'array' },
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

    },
    compatibility: {
      type: 'object',
      propertyNames: {
        level: 'number'
      }
    },
    showEntry: {
      type: 'boolean'
    }
  }
}

let defaultOptions = {
  devServer: {
    port: 3005,
    quiet: true,
    host: '0.0.0.0',
    hot: false,
  },
  appRoot: process.env.APP_ROOT ? path.resolve(process.cwd(),process.env.APP_ROOT) : process.cwd(),
  paths: paths,
  // 定义客户端环境
  clientEnv: envs.row,
  // 定义全局变量
  globalVar: {},
  compatibility: {
    level: 0
  },
  showEntry: false
}

function getUserOptions(root='./') {
  let options = {};

  let configPath = path.resolve(root, 'config/config.js');

  if (fse.existsSync(configPath)) {
    delete require.cache[configPath];
    options = require(configPath);
  }
  return options;
}

// 处理路径
function handlePaths(cwd, paths={}) {

  // 来着paths.js
  let filter = [
    'outputPath',
    'appSrc',
    'entryPoint',
    'appHtml',

  ];

  filter.forEach(name=>{
    if (paths.hasOwnProperty(name) && !path.isAbsolute(paths[name])) {

      paths[name] = path.resolve(cwd, paths[name]);
    }
  })

  return paths;
}

function handleGlobalVar(vars) {
  let out = {};
  for (const name in vars) {
    if (vars.hasOwnProperty(name)) {
      out['THA_'+name] = vars[name];
    }
  }
  return out;
}

function createOptions(){
  
  let userOp = getUserOptions(defaultOptions.appRoot);

  validator(schema, userOp , err=>{
    
    if (err) {

      let key = err.params.errors[0].params.additionalProperty;
      throw new Error(err.message + chalk.bold.red(` property: ${key}`));
    }
  });

  let thaOp = _.defaultsDeep(userOp, defaultOptions);
  validator(schema, thaOp);

  thaOp.paths = handlePaths(thaOp.appRoot, thaOp.paths);
  thaOp.globalVar = handleGlobalVar(thaOp.globalVar);

  validator(schema, thaOp);

  
  return thaOp;
}

let create = debounce.cache(1000, createOptions);


create.inject = function (op) {
  defaultOptions = _.defaultsDeep({}, op, defaultOptions)
}

create.update = ()=>{
  create(true)
}

module.exports = create;