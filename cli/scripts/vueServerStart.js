const Server = require('../lib/server')
const createOption = require('../config/options');
const path = require('path');
const openBrowser = require('../lib/dev-utils/openBrowser');
const util = require('../../utils/util')
const chalk = require('chalk')

let dbug = require('debug')('vueServerStart:')

module.exports = function () {
  let options = createOption(true);
  let config = require('../config/vue.config.js').toConfig();
  

  let server = new Server();

  let printOnce = util.execOnce(printBrowserOpenInfo)
  let openOnce = util.execOnce(openBrowser)

  server.hooks.listened.tap('serverStarted', (parsedUrl) => {
    dbug('listened')
    
  })
  server.hooks.firstTimeBuildDone.tap('serverStarted', (parsedUrl) => {
    dbug('firstTimeBuildDone')
    printOnce(parsedUrl);
    openOnce(parsedUrl.localUrl)

  })

  server.start(options.devServer, config);

  return {
    server,
    restart: ()=>{
      dbug('restart')
      let options = createOption();
      let config = require('../config/vue.config.js').toConfig();
      dbug('get new options and config')
      server.restart(options.devServer, config)
    },
    hooks: server.hooks
  };

}

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