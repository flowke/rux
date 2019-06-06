const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');

let dbug = require('debug')('server:')

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
      firstTimeBuildDone: new SyncHook(['parsedUrl']),
      listened: new SyncHook(['parsedUrl'])
    }
  }

  createCompiler(webpack, config) {
    let compiler = webpack(config);

    return compiler;
  }

  serve(validPort, serverConfig, webpackConfig) {

    let {
      host
    } = serverConfig;
    // WebpackDevServer.addDevServerEntrypoints(webpackConfig, serverConfig);
    let compiler = this.createCompiler(webpack, webpackConfig);
    const devServer = new WebpackDevServer(compiler, serverConfig);

    let parsedUrl = parseUrl('http', host, validPort);
    dbug('serve')
    let isFirstTime = true;
    devServer.listen(validPort, host, err => {
      if (err) {
        throw error
      }

      dbug('server listened at ' + validPort)
      this.hooks.listened.call(parsedUrl);

      compiler.hooks.done.tap('done', () => {
        dbug('compiler build done')
        if (!isFirstTime) return;
        isFirstTime = false;
        dbug('first time build done')
        this.hooks.firstTimeBuildDone.call(parsedUrl);
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
    dbug('get valid port: '+this.validPort)
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
    dbug('restart')
    this.run(devOption, webpackConfig);
    
  }

  restart(devOption, webpackConfig){
    dbug('restart call')
    if(!this.devServer) return;
    this.devServer.close();
    process.nextTick(()=>{
      dbug('restart reach')
      this.run(devOption, webpackConfig)
      
    });
  }

  close(){
    dbug('close')
    this.devServer && this.devServer.close();
  }

}