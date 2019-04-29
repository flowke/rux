const path = require('path');

module.exports = {
  entryPoint: path.resolve('./src/entry.js'),
  outputPath: path.resolve('./dist'),
  publicPath: '/',
  // 单页的 html 模板
  appHtml: '',
  //  app 文件夹
  appSrc: ''
}