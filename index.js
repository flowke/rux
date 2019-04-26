const webpackC = require('webpack-chain'); 
const fs = require('fs');
let cfg = new webpackC();

cfg.entry('index')
  .add('src/index.js')
  .end()

cfg.module
  .rule('lint')
  .test(/\.js$/)
  .pre()
  .include
  .add('src')
  .end()
  // Even create named uses (loaders)
  .use('eslint')
  .loader('eslint-loader')
  .options({
    rules: {
      semi: 'off'
    }
  });

let out = cfg.toString()

fs.writeFileSync('./json.json', JSON.stringify(out,undefined,2))

console.log(cfg.toConfig());
