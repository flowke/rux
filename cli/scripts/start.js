const createOption = require('../config/options');
const { watch, unwatch } = require('../lib/dev-utils/watch');
const chalk = require('chalk');
const path = require('path');
const type = require('../../utils/type');
const openBrowser = require('../lib/dev-utils/openBrowser');
const {
  SyncHook
} = require("tapable");


module.exports = function(target) {
  let runServer = path.resolve(__dirname, `${target}ServerStart.js`);

  let isFirstTimeOpen = true;

  let serve = require(runServer)();

  serve.hooks.started.tap('serverStarted', (parsedUrl)=>{
    if (isFirstTimeOpen) printBrowserOpenInfo(parsedUrl);
    isFirstTimeOpen = false;

    openBrowser(parsedUrl.localUrl)
  })

  let hooks = {
    restart: new SyncHook()
  }
  
  watchConfig(path => {

    serve.restart();
    hooks.restart.call();
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