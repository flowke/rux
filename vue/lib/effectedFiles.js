

module.exports = {
  services: 'src/services/*.js',
  init: 'src/init.js',
  router: 'src/router/index.js',
  util: 'src/utils/util.js',
  App: 'src/App.vue',
  template: 'src/index.html',
  config: 'config/*',
  multiPages: 'src/pages/pages.config.js',
  vuex: ['src/store/index.js', 'src/store/modules/*.js', 'src/pages/*/modules/*.js']
}