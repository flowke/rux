const chokidar = require('chokidar');
const type = require('../../utils/type');
const path = require('path');
let {getType} = type;

let appFn = null;

module.exports = function (cwd,cb=f=>f) {
  
  let watcher = chokidar.watch([
    'src/init.js',
    'src/App.vue',
    'src/index.html',
    'src/services/*',
    'src/utils/util.js',
    'src/router/*',
  ],{
    cwd
  });

  watcher
    .on('add', ()=>{cb({add: true})})
    .on('addDir', ()=>{cb({addDir: true})})
    .on('unlink', ()=>{cb({unlink: true})})

  chokidar.watch([
    'src/services/config.js',
    'src/init.js',
  ], {
      cwd
  })
    .on('change',(p)=>{
      if (p === 'src/app.js'){
        return cb({ appDefaultExport: true });
      }
      
      if (p === 'src/services/config.js'){

        return cb({ serviceNamespace: true});
      }
      
    })
}