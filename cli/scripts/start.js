const createOption = require('../config/options');
const { watch, unwatch } = require('../lib/dev-utils/watch');
const process = require('process');
const cp = require('child_process');
const chalk = require('chalk');
const path = require('path');
const type = require('../../utils/type');
const openBrowser = require('../lib/dev-utils/openBrowser');
const {
  SyncHook
} = require("tapable");


module.exports = function(target) {
  let runServer = path.resolve(__dirname, `${target}ServerStart.js`);
  let server = cp.fork(runServer);

  let isFirstTimeOpen = true;

  let hooks = {
    restart: new SyncHook()
  }

  server.on('message', m=>{

    if ((type(m, 'object') || m.msg === 'buildDone') && isFirstTimeOpen){

      isFirstTimeOpen = false;
      let parsedUrl = m.data;

      printBrowserOpenInfo(parsedUrl);
      openBrowser(parsedUrl.localUrl)
    }
  })
  
  watchConfig(path => {

    hooks.restart.call();
    server.kill();
    server = cp.fork(runServer)
  });

  process.on('SIGINT', function () {
    server.kill();
    process.exit();


  });

  return {
    hooks
  }

};


function printBrowserOpenInfo(urls) {
  console.log();
  console.log(chalk.cyan('opening the browser at:'));
  console.log();
  console.log(
    `  ${chalk.bold('Local:')}            ${urls.localUrlForTerminal}`
  );
  console.log(
    `  ${chalk.bold('On Your Network:')}  ${urls.lanUrlForTerminal}`
  );

  console.log();

}

function watchConfig(cb = f => f) {
  let { appRoot } = createOption();
  let watcher = watch('configDir', path.join(appRoot, 'config'));
  let timer = null;
  watcher.on('change', (path) => {

    clearTimeout(timer);
    timer = setTimeout(() => {

      console.log();
      console.log(chalk.bold.green('cause config file changed, try to restart the server...'));
      console.log(chalk.bold.green('  file: ' + path));
      console.log();

      cb(path);
    }, 500);
  });
  watcher.on('add', (path) => {
    clearTimeout(timer);
    timer = setTimeout(() => {

      console.log();
      console.log(chalk.bold.green('cause config file add, try to restart the server...'));
      console.log(chalk.bold.green('  file: ' + path));
      console.log();

      cb(path);
    }, 500);
  });
  watcher.on('unlink', (path) => {
    clearTimeout(timer);
    timer = setTimeout(() => {

      console.log();
      console.log(chalk.bold.green('cause config file unlink, try to restart the server...'));
      console.log(chalk.bold.green('  file: ' + path));
      console.log();

      cb(path);
    }, 500);
  });
}