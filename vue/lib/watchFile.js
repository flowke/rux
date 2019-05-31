const chokidar = require('chokidar');
const type = require('../../utils/type');
const path = require('path');
let {getType} = type;

let appFn = null;

module.exports = function (cwd,cb=f=>f) {
  
  let watcher = chokidar.watch([
    'src/app.js',
    'src/services/*',
    'src/utils/util.js',
    'src/router/*',
  ],{
    cwd
  });

  watcher
    .on('add', ()=>{cb()})
    .on('addDir', ()=>{cb()})
    .on('unlink', ()=>{cb()})

  chokidar.watch([
    'src/services/config.js',
    'src/app.js',
  ], {
      cwd
  })
    .on('change',(p)=>{
      if (p === 'src/app.js'){
        let fn = require(path.resolve(cwd, 'src/app.js')).default;
        if (getType(fn) === appFn){
          return;
        }
        appFn = getType(fn);
        return cb();
      }
      
    })
}