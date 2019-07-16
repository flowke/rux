const create = require('./createEntry');
const fse = require('fs-extra');
const option = require('../../cli/config/options');
const path = require('path');
const conf = require('../../cli/config/config');
const glob = require('globby');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = (cb)=>{

  let {
    showEntry,
    appRoot,
    multiPages
  } = option()

  const mayPath = require('./mayPath')(appRoot);
  
  let taskList = [];

  let entryBase = showEntry ? path.resolve(appRoot) : path.resolve(__dirname, '../../',)

  if (multiPages===true){
    let pageCfg = null;

    if (mayPath.multiPages(true)){
      pageCfg = require(path.resolve(appRoot, 'src/pages/pages.config.js'));
    }else{
      let files = glob.sync('*/index.vue', {
        cwd: path.resolve( appRoot, 'src/pages'),
        onlyFiles: true,
        deep: 1,
      });

      pageCfg = files.map((e)=>{
        return `${/(.+)\//.exec(e)[1]}:${e}`
      })
      
    }

    if(pageCfg){
      pageCfg = pageCfg.map(str=>{
        let arr = str.split(':').map(s=>s.trim());
        return {
          name: arr[0],
          path: arr[1] || `${arr[0]}/index.vue`
        }
      });
      

      conf.add(chain => {
        chain.entryPoints.delete('app')
        chain.plugins.delete('HtmlWebpackPlugin')

      }, 'before')

      pageCfg.forEach(e=>{
        let entry = path.resolve(entryBase, `.temp/.${e.name}.js`);

        conf.add(chain => {
          chain.entry(e.name)
            .add(entry);
        });

        let htmlPath = path.resolve(appRoot, `pages/${e.name}/index.html`);
        htmlPath = fse.existsSync(htmlPath) ? htmlPath : '';

        let htmlOption = {
          filename: `${e.name}.html`,
          // chunks: [e.name, 'vendors'],
          excludeChunks: pageCfg.reduce((acc,elt)=>{
            if(e.name!==elt.name) acc.push(elt.name)
            return acc
          },[])
        }
        if (htmlPath) htmlOption.template = htmlPath

        conf.html.add(`html${e.name}`, htmlOption);

        taskList.push(fse.outputFile(entry, create().code))
      })  
      
      conf.html.add(`multiEntry}`, {
        chunks: [],
        pages: pageCfg.map(e=>e.name+'.html'),
        template: path.resolve(__dirname, 'multi.html'),

      });

      
    }


  }else{
    let entry = path.resolve(entryBase, '.temp/.entry.js');
    conf.add(chain => {
      
      chain.entry('app')
        .clear()
        .add(entry);
      
    });
    taskList.push(fse.outputFile(entry, create().code));
  }

  

  return Promise.all(taskList)
  .then(()=>{
    cb && cb()
  })

  

}