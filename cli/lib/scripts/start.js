const paths = require('../../config/paths');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const fs = require('fs');
const configApi = require('../../config/react.config.js');
const serverConfig = require('../../config/options').devServer;
const chalk = require('chalk');
const tools = require('../utils/tools');
const detectPort = require('../utils/detectPort');


let compiler = webpack(configApi.toConfig());

let {port: dfPort} = serverConfig;

function serve(port = dfPort){
  const devServer = new WebpackDevServer(compiler, serverConfig);

  devServer.listeningApp.on('error', e=>{
    if(e.code==='EADDRINUSE'){
      // console.log('err');
      devServer.close();
      console.log(chalk.red(`port: ${port} is listened, use another port`));
      
      
    }else{
      throw e;
    }
    
  });
  

  devServer.listen(port, '0.0.0.0', err => {
    if (err) {
      throw error
    }

    compiler.hooks.done.tap('done', ()=>{

      console.log(chalk.cyan('Starting the development server...\n'));
      
      tools.openBrowser(`http://localhost:${port}`)
    })

  })
}

function run() {
  detectPort(dfPort)
  .then(valiPort=>{
    console.log(valiPort, 'valiPort');
    serve(valiPort);
    
    
    
  })
  .catch(e=>{
    console.log(e, '88');
    
  })
  
}

module.exports = run
