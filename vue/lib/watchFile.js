const chokidar = require('chokidar');
const type = require('../../utils/type');
const path = require('path');
const files = require('./effectedFiles');
const toArr = require('../../utils/toArr')
let {getType} = type;


module.exports = function (cwd,cb=f=>f) {
  
  let watcher = chokidar.watch(toArr(files).values,{
    cwd,
    ignoreInitial: true
  });

  function handler(path, ev) {
    let match = /services\/(.+)\.js/.exec(path)

    let isConfig = /config\/config/.test(path)
    
    if (ev === 'change' && match[1] && match[1] !== 'config'){
      return;
    }
    cb(path,{
      isConfig
    })
  }

  watcher
    .on('add', (p)=>handler(p, 'add'))
    .on('change', (p) => handler(p, 'change'))
    .on('unlink', (p) => handler(p, 'unlink'));


}