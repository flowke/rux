const createOption = require('../../cli/config/options');
const _ = require('lodash');
const fse = require('fs-extra');
const start = require('../../cli/scripts/vueServerStart');
const path = require('path');
const watchFile = require('../lib/watchFile');
const create = require('../lib/createEntry');
const debounce = require('../../utils/debounce')
const chalk = require('chalk')

let dbugEntry = require('debug')('emitEntry:')

dbugEntry('inject entry.')

createOption.inject({
  paths: {
    entryPoint: path.resolve(createOption().appRoot, '.temp/.entry.js')
  }
});

let startContext = null;

// 初始化
emitFile(create().code, ()=>{
  startContext = start();

});

watchFile(createOption().appRoot, debounce.exec(500, (emitPath, pathKey) => {

  dbugEntry('file change: ' + emitPath)
  dbugEntry('emitFile called cause file change: ' + emitPath)

  if (startContext && pathKey.isConfig){
    startContext.server.close();
  }

  emitFile(create().code, ()=>{

    if (pathKey.isConfig){
      console.log();
      console.log(chalk.bold.green('cause config file changed, try to restart the server...'));
      console.log(chalk.bold.green('  file: ' + emitPath));
      console.log();
      startContext.restart();
    } 
  });

}) )


function emitFile(code, cb) {
  fse.outputFile(path.resolve(createOption().appRoot, '.temp/.entry.js'), code, err => {
    if (err) throw err;

    dbugEntry('entry generated')

    cb && cb()
  })
}
