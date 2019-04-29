const paths = require('../config/paths');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const fs = require('fs');
const config = require('../../config/react.config.js');
const serverConfig = require('../../config/server.config.js');
const chalk = require('chalk');

let compiler = webpack(config.toConfig());

module.exports = function(){
  const devServer = new WebpackDevServer(compiler, serverConfig);

  devServer.listen(3000, '0.0.0.0', err => {
    if (err) {
      return console.log(err);
    }

    console.log(chalk.cyan('Starting the development server...\n'));
  })
}

