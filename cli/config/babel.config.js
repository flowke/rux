const path = require('path');

module.exports = function () {
  return {
    cwd: path.resolve(__dirname, '../../'),
    // presets: [
    //   "@babel/preset-env",
    //   "@babel/preset-react",
    // ],
    plugins: [
      ["@babel/plugin-proposal-decorators",{decoratorsBeforeExport: true}],
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-optional-chaining",
    ]
  }
}