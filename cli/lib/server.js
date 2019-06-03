const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');

const {
  SyncHook
} = require("tapable"); 

const {
  useValidPort,
  parseUrl
} = require('./dev-utils/devServerUtils');

module.exports = class Server {
  constructor(webpackConfig, devOption) {
    this.validPort = null;
    this.devServer = null;
    this.webpackConfig = webpackConfig;
    this.devOption = devOption;

    this.hooks = {
      buildDone: new SyncHook(['parsedUrl']),
      listened: new SyncHook()
    }
  }

  createCompiler(webpack, config) {
    let compiler = webpack(config);

    return compiler;
  }

  serve(validPort, serverConfig) {

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

      compiler.hooks.done.tap('done', () => {
        this.hooks.buildDone.call(parsedUrl);
      })

    });

    return devServer;
  }

  run() {

    let {
      port,
      host
    } = this.devOption;

    let p = null;

    if (this.validPort) {
      p = Promise.resolve(this.validPort)
    } else {
      p = useValidPort(port, host)
    }

    return p
      .then(valiPort => this.serve(valiPort, this.devOption))
      .catch(e => {

        console.log(chalk.cyan('stop launching the dev server.'));
        console.log('because:\n');
        console.log(e);

        process.exit(0);
      })

  }

  start() {

    process.on('warning', m => {
      console.log();
      console.log(chalk.yellow('warning on process:'));
      console.log();
      console.log(chalk.yellow.bold(m.message));
    })

    this.run(true);
    
  }

}