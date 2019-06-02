const Server = require('../lib/server')
const createOption = require('../config/options');
const path = require('path');

createOption.inject({
  paths: {
    entryPoint: path.resolve(__dirname, '../../', '.entry.js')
  }
});

let options = createOption();

let config = require('../config/vue.config.js').toConfig();

let server = new Server(config, options.devServer);

server.hooks.buildDone.tap('serverBuildDone', (parsedUrl)=>{
  
  process.send({
    msg: 'buildDone',
    data: parsedUrl
  })
});

server.start();