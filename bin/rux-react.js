#!/usr/bin/env node
const path = require('path');
require('@babel/register', {
  cwd: path.resolve(__dirname, '../'),
  presets: [
    
    ['@babel/preset-env', {
      target: {
        node: '10'
      }
    }]
  ]
})

const yargs = require('yargs');

yargs 
  .command('start', 'start devserver', {}, argv=>{
    process.env.NODE_ENV = "development"
    require('../cli/scripts/start.js')('react')
  })
  .help()

yargs.argv;