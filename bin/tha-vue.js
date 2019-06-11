#!/usr/bin/env node
const path = require('path')
const Create = require('../cli/lib/vue-create');
const toArr = require('../utils/toArr');

require('@babel/register')( {
  cwd: path.resolve(__dirname, '../'),
  ignore: [
    /node_modules/,
    /tha/
  ],
  plugins: ['@babel/plugin-transform-modules-commonjs']
})

const pkgInfo = require('../package.json')

const yargs = require('yargs');

let tplCfg = toArr(pkgInfo.configVue.templates);

yargs
  .alias('h', 'help')
  .alias('V', 'version')
  .command('dev', 'start devserver', {}, argv => {
    process.env.NODE_ENV = "development"
    require('../vue/scripts/dev')
  })
  .command('$0 <create-method> [dir]', 'create a project template into a directory with a template type', yargs=>{

    return yargs
      .positional('create-method', {
        describe: 'put template to current directory or init into a new directory',
        choices: ['put', 'init']
      })
      .options({
        type: {
          choices: tplCfg.keys,
          describe: tplCfg.values.reduce((acc, t)=>{
            return acc + `${t.name}\n${t.describe}\n\n`
          }, '')
        },
        force: {
          alias: 'f',
          describe: 'force to create',
          type: 'boolean'
        }
      })
  }, argv => {
    
    process.env.NODE_ENV = "development";
      new Create().run(argv, pkgInfo.configVue)
  })
  .help()

yargs.argv;

