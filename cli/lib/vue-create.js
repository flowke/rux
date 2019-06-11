const glob = require('globby');
const path = require('path');
const chalk = require('chalk');
const fse = require('fs-extra');
const inquirer = require('inquirer');
const toArr = require('../../utils/toArr');


function logExistDir(dir) {
  console.log();
  console.log(`Directory ${chalk.bold(path.resolve(dir) + '/')} already exists, please use another one.`);
  console.log();
}

module.exports = class Create{

  constructor(){
    this.argv = null;
    this.tplCfg = null;

    this.validDir = null;
    this.validType = null;
    this.validLocals = null;
  }


  run(argv, tplCfg){
    this.tplCfg = tplCfg
    this.argv = argv;

    let { createMethod } = argv;

    let p = Promise.resolve(null)

    if (createMethod === 'put') p = this.getPutDir()
    if (createMethod === 'init') p = this.getInitDir()

    p
    .then(dir=>{
      if(dir){
        this.validDir = dir;
        return this.getTemplateType()
      }
    })
    .then(type=>{
      if(type){
        this.validType = type;
        return this.getTemplateLocals()
      }
    })
    .then(locals=>{
      if(locals){
        this.validLocals = locals;
      }
    })
    
  }

  getInitDir(){
    let { dir } = this.argv;

    let p = Promise.resolve(null);

    if(dir){
      p = Promise.resolve(dir)
      .then(dir=>{
        let existDir = fse.existsSync(path.resolve(dir))
        if (existDir) {
          logExistDir(dir)
          return null
        }

        return path.resolve(dir)
      })
    }else[
      p = this.askDir()
        .then(dir => path.resolve(dir))
    ]

    return p

  }

  getPutDir(){
    let { force } = this.argv;

    let files = glob.sync('*', {deep: 1, onlyFiles: false});

    let dir = process.cwd();

    if(force){
      fse.emptyDirSync(dir);

    }else if(files.length){

      let fdName = path.basename(dir);

      console.log();
      console.log(`There is something in ${chalk.bold(fdName+'/')} directory, make sure it is clean or use '--force' to clean it first.`);
      console.log();

      console.log(chalk.green(`|-${fdName}`));
      files.forEach(e=>{
        console.log(chalk.green(`  |-${e}`));
      })
      console.log();
      dir = null
    }


    return Promise.resolve(dir)

  }

  askDir(){
    return inquirer.prompt([
      {
        message: 'type a directory name to init:',
        name: 'dir',
        validate: function(dir){
          // console.log(dir, typeof dir, 'dir')
          if(!dir) return 'dir must be a valid name';

          if (fse.existsSync(path.resolve(dir))) {
            return `Directory ${chalk.bold(path.resolve(dir) + '/')} already exists, please use another one.`
          }
          return true
        }
      }
    ])
    .then(val=>val.dir)
  }

  askTemplate(){

    let cfg = toArr(this.tplCfg)
    
    return inquirer. prompt([
      {
        type: 'list',
        message: 'please choose a template',
        name: 'type',
        choices: cfg.values.map(e=>{
          return {
            name: e.name + '  ' + e.describe,
            value: e.name
          }
        })
      }
    ])
    .then(v => v.type)
  }

  askTemplateInfo(dir){
    let dirname = path.basename(this.validDir)
    return inquirer.prompt([
      {
        message: 'projece name: ',
        default: dirname,
        name: 'name',
      }
    ])
  }

  getTemplateType(){
    let {type } = this.argv;

    if (type && this.tplCfg[type]){
      return Promise.resolve(type)
    }else if(!type){
      return this.askTemplate()
    }else{
      return Promise.resolve(null)
    }

  }

  getTemplateLocals(){
    return Promise.resolve({
      name: path.basename(this.validDir)
    })
  }

  generate(){
    let { validDir, validType, validLocals} = this;
    
  }


}