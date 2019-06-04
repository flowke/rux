const createOption = require('../../cli/config/options');
const _ = require('lodash');
const fse = require('fs-extra');
const start = require('../../cli/scripts/start');
const path = require('path');
const watchFile = require('../lib/watchFile');
const create = require('../lib/createEntry');
const debounce = require('../../utils/debounce')

let started = false;

function emitFile(code, cb) {
  fse.outputFile(path.resolve(__dirname,'../../', '.entry.js'), code, err => {
    if(err) throw err;

    cb && cb()

  })
}

let prevContext = create();

emitFile(prevContext.code, ()=>{
  if (!started) {
    let startContext = start('vue');
    console.log('start');
    
    startContext.hooks.restart.tap('restart', () => {

      console.log('restart, dev');
      
      emitFile(create().code)
    })
  }
  started = true;
});



watchFile(createOption().appRoot, debounce.exec(500, (emitPath) => {
  let {
    code,
    context
  } = create();

  // if (emitPath.serviceNamespace && _.isEqual(context.serviceNamespace, prevContext.namespace)){
  //   return ;
  // }

  emitFile(code);
  prevContext = context

}) )





