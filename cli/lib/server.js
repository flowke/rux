const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');

let dbug = require('debug')('server: ')

const {
  SyncHook
} = require("tapable"); 

const {
  useValidPort,
  parseUrl
} = require('./dev-utils/devServerUtils');

module.exports = class Server {
  constructor() {
    this.validPort = null;
    this.devServer = null;

    this.hooks = {
      started: new SyncHook(['parsedUrl']),
      listened: new SyncHook()
    }
  }

  createCompiler(webpack, config) {
    let compiler = webpack(config);

    return compiler;
  }

  serve(validPort, serverConfig, webpackConfig) {

    let {
      port: dfPort,
      host
    } = serverConfig;

    let compiler = this.createCompiler(webpack, webpackConfig);
    const devServer = new WebpackDevServer(compiler, serverConfig);

    let parsedUrl = parseUrl('http', host, validPort);

    devServer.listen(validPort, host, err => {
      if (err) {
        throw error
      }
      dbug('server listened at ' + validPort)

      let isFirstTime = true;
      compiler.hooks.done.tap('done', () => {
        if (!isFirstTime) return;
        isFirstTime = false;
        dbug('build done')
        this.hooks.started.call(parsedUrl);
      })

    });

    return devServer;
  }

  run(devOption, webpackConfig) {

    let {
      port,
      host
    } = devOption;

    let p = null;

    if (this.validPort) {
      p = Promise.resolve(this.validPort)
    } else {
      p = useValidPort(port, host)
        .then(port => this.validPort=port)
    }

    return p
      .then(valiPort => {
        this.devServer = this.serve(valiPort, devOption, webpackConfig);
      })
      .catch(e => {

        console.log(chalk.cyan('stop launching the dev server.'));
        console.log('because:\n');
        console.log(e);

        process.exit(0);
      })

  }

  start(devOption, webpackConfig) {

    process.on('warning', m => {
      console.log();
      console.log(chalk.yellow('warning on process:'));
      console.log();
      console.log(chalk.yellow.bold(m.message));
    })

    this.run(devOption, webpackConfig);
    
  }

  restart(devOption, webpackConfig){
    if(this.devServer) return;
    this.devServer.close();
    process.nextTick(()=>{
      this.run(devOption, webpackConfig)
      dbug('restart')
    });
  }

  close(){
    dbug('close')
    this.devServer && this.devServer.close();
  }

}