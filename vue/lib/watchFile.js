const chokidar = require('chokidar');
const type = require('../../utils/type');
const path = require('path');
const files = require('./effectedFiles');
const toArr = require('../../utils/toArr')
let {getType} = type;


module.exports = function (cwd,cb=f=>f) {

  let { vuex, ...restFiles } = files
  
  
  let watcher = chokidar.watch(toArr(restFiles).values.concat(vuex),{
    cwd,
    ignoreInitial: true
  });

  function handler(path, ev) {
    let servicesApiMatch = /services\/(.+)\.js$/.exec(path)

    let vuexModulesMatch = /modules\/(.+)\.js$/.exec(path);

    let isConfig = /config\/config/.test(path)
    
    if (ev === 'change' && servicesApiMatch && servicesApiMatch[1] && servicesApiMatch[1] !== 'config') {
      return;
    }
    if (ev === 'change' && vuexModulesMatch) {
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