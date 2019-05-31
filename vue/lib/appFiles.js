const glob = require('globby');
const path = require('path');

module.exports = function(root) {
  
  let services = glob.sync('services/*.js', {
    cwd: path.join(root),
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

  }

}

