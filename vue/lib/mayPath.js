const glob = require('globby');
const path = require('path');
const fse = require('fs-extra');
const files = require('./effectedFiles');

// which effectedFile is present

module.exports = function(root) {

  let { services, ...restFiles } = files;

  function mayPath(p = '') {
    p = path.resolve(root, p);
    return fse.existsSync(p)? p: '';
  }
  
  let servicesFiles = glob.sync(services, {
    cwd: root,
    onlyFiles: true,
    deep: 0
  });
  
  

  let mayPaths = Object.keys(restFiles).reduce((acc, f)=>{
    acc[f] = (abs) => {
      let file = mayPath(restFiles[f]);

      if (file && abs) return path.resolve(root, file)  
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

    ...mayPaths
  }

}

