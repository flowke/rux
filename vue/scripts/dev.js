const createOption = require('../../cli/config/options');
const start = require('../../cli/scripts/vueServerStart');
const watchFile = require('../lib/watchFile');
const debounce = require('../../utils/debounce')
const chalk = require('chalk')
const emitEntry = require('../lib/emitEntry');

let dbugEntry = require('debug')('emitEntry:')

// determine when to create entry and start the server

let startContext = null;

// 初始化
emitEntry(()=>{
  startContext = start();

});

watchFile(createOption().appRoot, debounce.exec(500, (emitPath, pathKey) => {

  dbugEntry('file change: ' + emitPath)
  dbugEntry('emitFile called cause file change: ' + emitPath)

  if (startContext && pathKey.isConfig){
    startContext.server.close();
  }

  emitEntry(()=>{

    if (pathKey.isConfig){
      console.log();
      console.log(chalk.bold.green('cause config file changed, try to restart the server...'));
      console.log(chalk.bold.green('  file: ' + emitPath));
      console.log();
      startContext.restart();
    } 
  });

}) )
