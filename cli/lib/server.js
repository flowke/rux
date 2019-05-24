const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const openBrowser = require('./dev-utils/openBrowser');
const createOption = require('../config/options');
const { watch, unwatch } = require('./dev-utils/watch');

const {
  useValidPort,
  parseUrl
} = require('./dev-utils/devServerUtils');

function printBrowserOpenInfo(urls) {
  console.log(
    `  ${chalk.bold('Local:')}            ${urls.localUrlForTerminal}`
  );
  console.log(
    `  ${chalk.bold('On Your Network:')}  ${urls.lanUrlForTerminal}`
  );

  console.log();

}

module.exports = class Server {
  constructor(webpackConfig) {
    this.validPort = null;
    this.devServer = null;
    this.webpackConfig = webpackConfig;
    this.configOptions = createOption();
  }

  createCompiler(webpack, config) {
    let compiler = webpack(config);

    return compiler;
  }

  serve(validPort, serverConfig, open = true) {

    let {
      port: dfPort,
      host
    } = serverConfig;

    let compiler = this.createCompiler(webpack, this.webpackConfig);
    const devServer = new WebpackDevServer(compiler, serverConfig);

    let parsedUrl = parseUrl('http', host, dfPort);

    devServer.listen(validPort, host, err => {
      if (err) {
        throw error
      }

      this.devServer = devServer;
      this.validPort = validPort;

      // 第一次编译完成
      let isFistTimeCompile = true;
      compiler.hooks.done.tap('done', () => {

        if (isFistTimeCompile && open) {

          console.log();
          console.log(chalk.cyan('opening the browser at: \n'));

          printBrowserOpenInfo(parsedUrl);
          openBrowser(parsedUrl.localUrl);

          isFistTimeCompile = false;

        }

      })

    });



    return devServer;
  }

  run(openBrowser) {

    let {
      devServer,
      devServer: {
        port,
        host
      }
    } = this.configOptions;

    let p = null;

    if (this.validPort) {
      p = Promise.resolve(this.validPort)
    } else {
      p = useValidPort(port, host)
    }

    return p
      .then(valiPort => this.serve(valiPort, devServer, openBrowser))
      .catch(e => {

        console.log(chalk.cyan('stop launching the dev server.'));
        console.log('because:\n');
        console.log(e);

        process.exit(0);
      })

  }

  watchConfig(cb = f => f) {
    let { appRoot } = this.configOptions;
    let watcher = watch('configDir', path.join(appRoot, 'config'));
    let timer = null;
    watcher.on('change', (path) => {
      // debounce
      clearTimeout(timer);
      timer = setTimeout(() => {

        console.log();
        console.log(chalk.bold.green('cause config file changed, try to restart the server...'));
        console.log();

        cb(path);
      }, 500);
    });
  }


  restart() {
    this.configOptions = createOption();
    return run(false)
  }

  start() {

    process.on('warning', m => {
      console.log();
      console.log(chalk.yellow('warning on process:'));
      console.log();
      console.log(chalk.yellow.bold(m.message));
    })

    this.run(true);

    this.watchConfig(path => {

      if (!this.server) return;
      this.server.close();
      this.server = null;
      process.nextTick(this.restart);

    });
  }

}