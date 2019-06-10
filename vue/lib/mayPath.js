const glob = require('globby');
const path = require('path');
const fse = require('fs-extra');
const files = require('./effectedFiles');

// which effectedFile is present\



module.exports = function(root) {
  let baseGlobOption = {
    cwd: root,
    onlyFiles: true,
  }

  let { services, vuex, ...restFiles } = files;

  function ifAbs(abs, file){
    return abs ? path.resolve(root, file) : file
  }

  function mayPath(p = '') {
    p = path.resolve(root, p);
    return fse.existsSync(p)? p: '';
  }
  
  let servicesFiles = glob.sync(services, {
    ...baseGlobOption,
    deep: 0
  });

  let vuexConfig = glob.sync(vuex[0], baseGlobOption)
  let vuexModules = glob.sync(vuex.slice(1), baseGlobOption)

  let vuexPaths = {
    config: ()=>'',
    modules: []
  }

  if (vuexConfig[0]) vuexPaths.config = abs => ifAbs(abs, vuexConfig[0])

  vuexPaths.modules = vuexModules.map(m=>{
    return {
      name: path.basename(m, '.js'),
      file: abs=> ifAbs(abs, m)
    }
  })

  let mayPaths = Object.keys(restFiles).reduce((acc, f)=>{
    acc[f] = (abs) => {
      let file = mayPath(restFiles[f]);

      if (file && abs) return ifAbs(abs, file)  
      return file
    } 
    return acc;
  },{})

  return {
    services: servicesFiles.reduce((acc,file)=>{
      let name = path.basename(file, '.js')
      if (name ==='config'){
        acc.config = (abs)=>{
          return abs? path.resolve(root, file) : file
        }
      }else{
        acc.apis.push({
          name,
          path: (abs) => {
            return abs ? path.resolve(root, file) : file
          }
        })
      }
      return acc
    },{
      config: ()=>'',
      apis: []
    }),
    vuex: vuexPaths,
    ...mayPaths
  }

}

