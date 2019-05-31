const type = require('../../utils/type')
const createOption = require('../../cli/config/options');
const parseNamespace = require('../lib/requestNamespace');
const _ = require('lodash');
const getAppFiles = require('../lib/appFiles');
const fse = require('fs-extra');
const start = require('../../cli/scripts/start');
const path = require('path');
const watchFile = require('../lib/watchFile')

createOption.inject({
  paths: {
    entryPoint: __dirname+ '/.entry.js'
  }
});

function create() {

  let {
    request = true,
    router,
    appRoot,
    paths: optionsPaths
  } = createOption();


  let appFiles = getAppFiles(optionsPaths.appSrc)

  let importTpl = '';
  let vueTpl = '';
  let routerTpl = '';
  let reqTpl = '';
  let initTpl = '';



  // vue
  importTpl += `import Vue from 'vue/dist/vue.runtime.esm'\n`

  // router
  if(router===true){
    importTpl +=`import Router from 'vue-router'\n`
    routerTpl +=
      `Vue.use(Router)\n`;

    // if(){}
  }



  vueTpl +=
    `let vm = new Vue({
      el: '#root',
      render: h=>{
        return <div>我在这里</div>
      }
    })
    \n`;

  // requset
  if (request) {

    let reqConfig = {
      namespace: parseNamespace({}),
    };

    let optionCode = '';
    if (appFiles.services.config) {
      let config = require(path.join(optionsPaths.appSrc, appFiles.services.config));
      reqConfig.namespace = parseNamespace(config.namespace);

      importTpl += `import * as serviceCfg from '@/services/config';\n`;
      optionCode = `serviceCfg.options`
    } else {

    }

    reqTpl +=
      `let req = new Request(${optionCode});

      window.${reqConfig.namespace.requestName} = req;
      window.${reqConfig.namespace.pathNamespace} = req.apis;
      window.${reqConfig.namespace.moduleNamespace} = req.mApis;\n`;

    appFiles.services.apis.forEach(file => {
      importTpl += `import __${file.name} from '@/${file.path}';\n`;
      reqTpl += `req.moduleRegister(__${file.name}, '${file.name}');\n`;
    })



    importTpl +=
      `import Request from 'puta';\n`
  }


  // utils
  if (fse.existsSync(path.resolve(optionsPaths.appSrc, 'utils/util.js'))) {
    importTpl += `import * as util from '@/utils/util';\n`
    initTpl += `window.$util = util\n`
  }

  // app init
  if (fse.existsSync(path.resolve(optionsPaths.appSrc, 'app.js'))) {
    let fn = require(path.resolve(optionsPaths.appSrc, 'app.js'))
    importTpl += `import app from '@/app';\n`

    if(type(fn.default, 'function')){
      initTpl += `app(vm);\n`
    }
    
    
  }

  return importTpl + vueTpl + routerTpl + reqTpl + initTpl;
}

let started = false;

function emitFile() {
  fse.outputFile(path.resolve(__dirname, '.entry.js'), create(), err => {
    if(!started) start('vue');
    started = true;
  })
}

emitFile();

// debounce
let timer = null
watchFile(createOption().appRoot, ()=>{
  clearTimeout(timer);
  timer = setTimeout(() => {
    emitFile();
  }, 500);
  
})





