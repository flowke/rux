const path = require('path');

let cwd = process.cwd();

module.exports = {
  entryPoint: path.resolve('./src/app.js'),
  outputPath: path.resolve('./dist'),
  publicPath: '/',
  // 单页的 html 模板
  appHtml: path.resolve('./src/index.html'),
  //  app 文件夹
  appSrc: path.resolve('./src')
}