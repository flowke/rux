#!/usr/bin/env node
const yargs = require('yargs');

yargs 
  .command('start', 'start devserver', {}, argv=>{
    process.env.NODE_ENV = "development"
    require('../cli/lib/scripts/start.js')()
  })
  .help()

yargs.argv;