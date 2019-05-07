const paths = require('../../config/paths');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const fs = require('fs');
const configApi = require('../../config/react.config.js');
const serverConfig = require('../../config/options').devServer;
const chalk = require('chalk');
const openBrowser = require('../dev-utils/openBrowser');
const {
  useValidPort,
  parseUrl
} = require('../dev-utils/devServerUtils');

function printBrowserOpenInfo(urls) {
  console.log(
    `  ${chalk.bold('Local:')}            ${urls.localUrlForTerminal}`
  );
  console.log(
    `  ${chalk.bold('On Your Network:')}  ${urls.lanUrlForTerminal}`
  );

  console.log();
  

}


let compiler = webpack(configApi.toConfig());
let isFistTimeCompile = true;

let {
  port: dfPort,
  host
} = serverConfig;


let parsedUrl = parseUrl('http', host, dfPort);

function serve(port){
  const devServer = new WebpackDevServer(compiler, serverConfig);

  
  devServer.listen(port, host, err => {
    if (err) {
      throw error
    }

    

    compiler.hooks.done.tap('done', ()=>{

      if (isFistTimeCompile){

        console.log();
        console.log(chalk.cyan('opening the browser at: \n'));

        printBrowserOpenInfo(parsedUrl);
        openBrowser(parsedUrl.localUrl);
        
        isFistTimeCompile = false;
        
      }
      
    })

  })
}

function run() {
  useValidPort(dfPort, host)
  .then(valiPort=>{
    serve(valiPort);
  })
  .catch(e=>{
    console.log(chalk.cyan('stop launching the dev server.'));
  });
  
}

module.exports = run
