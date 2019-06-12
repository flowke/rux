const glob = require('globby');
const path = require('path');
const chalk = require('chalk');
const fse = require('fs-extra');
const inquirer = require('inquirer');
const toArr = require('../../utils/toArr');
const request = require('axios');
const shell = require('shelljs');
const compressing = require('compressing');
const os = require('os');
const ora = require('ora');


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

    this.hasNpm = shell.which('npm')
    
  }


  run(argv, tplCfg){
    this.tplCfg = tplCfg
    this.argv = argv;

    

    

    // console.log(process.env);
    // console.log(process.env.npm_registry);
    // console.log(process.env.npm_config_registry);
    

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
        return this.generate()
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

    let cfg = toArr(this.tplCfg.templates)
    
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

    if (type && this.tplCfg.templates[type]){
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
    let { validDir, validType, validLocals, tplCfg} = this;


    this.downloadPackage(tplCfg.package)
    .then(tempdir=>{

      if (tempdir){
        console.log(tempdir);
        
      }

    })
    
  }

  downloadPackage(packageName){
    let registry = this.getRegistry();

    let url = `${registry}/${packageName}/latest`;

    

    const getTarball = ()=>{
      return this.request(url)
        .then(res => {
          // return null
          return this.request(res.dist.tarball, { responseType: 'arraybuffer' })
        })
        .catch(()=>{
          return null
        })
    }

    const spinner = ora('downloading template').start();
    let tempdir = '';
    return getTarball()
    .then(tarball=>{
      // 下载失败
      if (!tarball){
        spinner.fail('downloading template fail')
        throw new Error('download fail')
      }

      spinner.succeed('downloading template succeed!')

      tempdir = path.resolve(os.tmpdir(), 'tha-vue-create-config')

      shell.rm('-rf', tempdir);
      
      return compressing.tgz.uncompress(tarball, tempdir)
    })
    .then(done=>{
      spinner.succeed('uncompress template succeed!')
      
      return path.resolve(tempdir, 'package')
    })
    .catch(err=>{
      console.log(err);
      
      if (err.message !== 'download fail'){
        spinner.fail('uncompress template fail')
      }

      process.exit(1)
    })



  }

  getRegistry(){
    let url = '';

    if (!this.hasNpm) {
      console.log(chalk.red('Ensure npm has been installed!'))
      process.exit(1);
    }
    

    try {
      
      url = shell.exec('npm config get registry', { silent: true }).stdout;
      url = url.trim();
      url = url.replace(/\/$/, '');

    } catch (error) {
      url = ''
    }

    if(!url){
      console.log(chalk.red('Make sure you set a valid npm registry url'));
      process.exit(1)
    }

    return url;

  }

  request(url, op){
    return request(url,op)
    .then(res=>{
      return res.data
    })
  }


}