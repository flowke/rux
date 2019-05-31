#!/usr/bin/env node
const path = require('path');
require('@babel/register',{
  cwd: path.resolve(__dirname, '../'),
  ignore: [
    /node_modules/,
    path.resolve(__dirname, '../cli')
  ],
  presets: [
    ['@babel/preset-env',{
      target: {
        node: 'current'
      },
      useBuiltIns: false
    }]
  ]
})


const yargs = require('yargs');

yargs
  .command('start', 'start devserver', {}, argv => {
    process.env.NODE_ENV = "development"
    require('../cli/scripts/start.js.js')('vue')
  })
  .command('dev', 'start devserver', {}, argv => {
    process.env.NODE_ENV = "development"
    require('../vue/scripts/dev')
  })
  .help()

yargs.argv;