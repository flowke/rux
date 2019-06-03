const glob = require('globby');
const path = require('path');
const fse = require('fs-extra');


module.exports = function(src) {


  function mayPath(p = '') {
    p = path.resolve(src, p);
    return fse.existsSync(p)? p: '';
  }
  
  let services = glob.sync('services/*.js', {
    cwd: path.join(src),
    onlyFiles: true,
    deep: 0
  });
  
  

  return {
    services: services.reduce((acc,file)=>{
      let name = path.basename(file, '.js')
      if (name ==='config'){
        acc.config = file
      }else{
        acc.apis.push({
          name,
          path: file
        })
      }
      return acc
    },{
      config: '',
      apis: []
    }),

    init: mayPath('init.js'),
    router: mayPath('router/index.js'),
    util: mayPath('utils/util.js'),
    App: mayPath('App.vue'),
    
  }

}

