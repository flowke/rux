const chokidar = require('chokidar');
const type = require('../../utils/type');
const path = require('path');
let {getType} = type;


module.exports = function (cwd,cb=f=>f) {
  
  let watcher = chokidar.watch([
    'src/init.js',
    'src/App.vue',
    'src/index.html',
    'src/services/*',
    'src/utils/util.js',
    'src/router/index.js',
  ],{
    cwd
  });

  watcher
    .on('add', (ev)=>{cb('add '+ev)})
    .on('addDir', (ev)=>{cb('addDir '+ev)})
    .on('unlink', (ev)=>{cb(ev)})

  chokidar.watch([
    'src/services/config.js',
    'src/init.js',
  ], {
      cwd
  })
    .on('change',(p)=>{
      if (p === 'src/app.js'){
        return cb(p);
      }
      
      if (p === 'src/services/config.js'){

        return cb(p);
      }
      
    })
}