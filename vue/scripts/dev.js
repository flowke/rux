const type = require('../../utils/type')
const createOption = require('../../cli/config/options');
const parseNamespace = require('../lib/requestNamespace');
const _ = require('lodash');
const getAppFiles = require('../lib/appFiles');
const fse = require('fs-extra');
const start = require('../../cli/scripts/start');
const path = require('path');
const watchFile = require('../lib/watchFile');
const assert = require('assert').strict;

createOption.inject({
  paths: {
    entryPoint: __dirname+ '/.entry.js'
  }
});



function create() {

  let {
    request = true,
    router,
    paths: optionsPaths
  } = createOption();

  let { appSrc } = optionsPaths;

  let appFiles = getAppFiles(appSrc)

  let importTpl = '';
  let vueTpl = '';
  let routerTpl = '';
  let reqTpl = '';
  let initTpl = '';

  let vueOptions = '';

  // vue
  importTpl += `import Vue from 'vue/dist/vue.runtime.esm'\n`

  // router
  if(router===true){
    importTpl +=`import Router from 'vue-router'\n`
    routerTpl +=
      `Vue.use(Router)\n`;

    if(appFiles.router){
      importTpl += `import routerOption from '@/router/index'\n`
      routerTpl += `let router = new Router(routerOption)`
      vueOptions+='router,\n'
    }
  }

  vueTpl +=
    `let vm = new Vue({
      el: '#root',
      ${vueOptions}
      render: h=>{
        return <div>我在这里</div>
      }
    })
    \n`;

  let context = {
    appExportDefault: null
  }

  // requset
  if (request) {
    context.namespace = parseNamespace({});

    let optionCode = '';
    if (appFiles.services.config) {
      delete require.cache[path.resolve(appSrc, appFiles.services.config)];
      let config = require(path.resolve(appSrc, appFiles.services.config) );

      context.namespace = parseNamespace(config.namespace);
      
      
      // 如果导出了options
      if(config.options){
        importTpl += `import * as serviceCfg from '@/services/config';\n`;
        optionCode = `serviceCfg.options`
      }

    }

    reqTpl +=
      `let req = new Request(${optionCode});

      window.${context.namespace.requestName} = req;
      window.${context.namespace.pathNamespace} = req.apis;
      window.${context.namespace.moduleNamespace} = req.mApis;\n`;

    appFiles.services.apis.forEach(file => {
      importTpl += `import __${file.name} from '@/${file.path}';\n`;
      reqTpl += `req.moduleRegister(__${file.name}, '${file.name}');\n`;
    })

    importTpl +=
      `import Request from 'puta';\n`
  }


  // utils
  if (appFiles.util) {
    importTpl += `import * as util from '@/utils/util';\n`
    initTpl += `window.$util = util\n`
  }

  // app init
  if (appFiles.app) {
    delete require.cache[path.resolve(appSrc, 'app.js')];
    let fn = require(path.resolve(appSrc, 'app.js'))
    importTpl += `import app from '@/app';\n`
    context.appExportDefault = fn.default;
    if(type(fn.default, 'function')){
      initTpl += `app(vm, Vue);\n`
    }
    
  }

  return {
    code: importTpl + vueTpl + routerTpl + reqTpl + initTpl,
    serviceNamespace: context.namespace,
    appExportDefault: context.appExportDefault
  } 
}

let started = false;

function emitFile(code) {
  fse.outputFile(path.resolve(__dirname, '.entry.js'), code, err => {
    if(!started) start('vue');
    started = true;
  })
}

let prevContext = create();

emitFile(prevContext.code);

// debounce
let timer = null
watchFile(createOption().appRoot, (emitPath)=>{
  clearTimeout(timer);
  timer = setTimeout(() => {
    let {
      code,
      context
    } = create();

    // if (emitPath.serviceNamespace && _.isEqual(context.serviceNamespace, prevContext.namespace)){
    //   return ;
    // }
    
    emitFile(code);
    prevContext = context
    
  }, 500);
  
})





