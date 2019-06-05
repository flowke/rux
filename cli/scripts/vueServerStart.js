const Server = require('../lib/server')
const createOption = require('../config/options');
const path = require('path');

// createOption.inject({
//   paths: {
//     entryPoint: path.resolve(__dirname, '../../', '.entry.js')
//   }
// });



// server.hooks.started.tap('serverBuildDone', (parsedUrl)=>{
  
//   process.send({
//     msg: 'serverStarted',
//     data: parsedUrl
//   })
// });

module.exports = function () {
  let options = createOption();

  let config = require('../config/vue.config.js').toConfig();

  let server = new Server();

  server.start(options.devServer, config);

  return {
    server,
    restart: ()=>{
      let options = createOption();
      let config = require('../config/vue.config.js').toConfig();
      server.restart(options.devServer, config)
    },
    hooks: server.hooks
  };

}