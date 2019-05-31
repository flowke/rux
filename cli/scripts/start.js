const Server = require('../lib/server')

module.exports = function(target) {
  let config;
  if (target === 'vue') config = require('../config/vue.config.js').toConfig();
  if (target === 'react') config = require('../config/react.config.js').toConfig();
  new Server(config).start();

};

// todo
// - APP_ROOT