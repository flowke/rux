const createOption = require('../../cli/config/options');
const _ = require('lodash');
const fse = require('fs-extra');
const start = require('../../cli/scripts/start');
const path = require('path');
const watchFile = require('../lib/watchFile');
const create = require('../lib/createEntry');

let started = false;

function emitFile(code) {
  fse.outputFile(path.resolve(__dirname,'../../', '.entry.js'), code, err => {
    if(!started) start('vue');
    started = true;
  })
}

let prevContext = create();

emitFile(prevContext.code);

// debounce
let timer = null
watchFile(createOption().appRoot, (emitPath)=>{
  clearTimeout(timer);
  timer = setTimeout(() => {
    let {
      code,
      context
    } = create();

    // if (emitPath.serviceNamespace && _.isEqual(context.serviceNamespace, prevContext.namespace)){
    //   return ;
    // }
    
    emitFile(code);
    prevContext = context
    
  }, 500);
  
})





