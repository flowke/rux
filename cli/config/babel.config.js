const path = require('path');

module.exports = function (cfg) {

  

  return {
    cwd: path.resolve(__dirname, '../../'),
    presets: [
      ["@babel/preset-env",{
        modules: false,
        useBuiltIns: 'usage',
        ...cfg.env || {}
      }]
    ],

    plugins: [
      "@babel/plugin-syntax-jsx",
      "babel-plugin-transform-vue-jsx",
      ["@babel/plugin-transform-runtime"],
      ["@babel/plugin-proposal-decorators",{decoratorsBeforeExport: true}],
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-optional-chaining",
    ]
  }
}