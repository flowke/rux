const createOption = require('../config/options');
const { watch, unwatch } = require('./dev-utils/watch');
var process = require('process');
var cp = require('child_process');
const chalk = require('chalk');

module.exports = function(target) {
  
  watchConfig(path => {

    

  });
};


function watchConfig(cb = f => f) {
  let { appRoot } = createOption();
  let watcher = watch('configDir', path.join(appRoot, 'config'));
  let timer = null;
  watcher.on('change', (path) => {
    // debounce
    clearTimeout(timer);
    timer = setTimeout(() => {

      console.log();
      console.log(chalk.bold.green('cause config file changed, try to restart the server...'));
      console.log(chalk.bold.green('  file: ' + path));
      console.log();

      cb(path);
    }, 500);
  });
}