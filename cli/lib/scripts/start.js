const paths = require('../../config/paths');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const fs = require('fs');
const configApi = require('../../config/react.config.js');
const serverConfig = require('../../config/options').devServer;
const chalk = require('chalk');
const tools = require('../utils/tools');


let compiler = webpack(configApi.toConfig());

let {port} = serverConfig;

module.exports = function(){
  const devServer = new WebpackDevServer(compiler, serverConfig);

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

