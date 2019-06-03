const parseNamespace = require('./requestNamespace');
const type = require('../../utils/type')
const createOption = require('../../cli/config/options');
const getAppFiles = require('./appFiles');
const path = require('path');
module.exports = function create() {

  let {
    request = true,
    router,
    paths: optionsPaths
  } = createOption();

  console.log(router, 'router');
  

  let { appSrc } = optionsPaths;

  let appFiles = getAppFiles(appSrc)

  let importTpl = '';
  let vueTpl = '';
  let routerTpl = '';
  let reqTpl = '';
  let initTpl = '';
  let appTpl = '';

  

  // vue
  importTpl += `import Vue from 'vue/dist/vue.runtime.esm'\n`

  // router
  if (router === true) {
    

    if (router && appFiles.router) {
      
    }
  }

  

  let context = {
    appExportDefault: null
  }

  // requset
  if (request) {
    context.namespace = parseNamespace({});

    let optionCode = '';
    if (appFiles.services.config) {
      delete require.cache[path.resolve(appSrc, appFiles.services.config)];
      let config = require(path.resolve(appSrc, appFiles.services.config));

      context.namespace = parseNamespace(config.namespace);


      // 如果导出了options
      if (config.options) {
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

  // init file
  if (appFiles.init) {
    delete require.cache[path.resolve(appSrc, 'init.js')];
    let fn = require(path.resolve(appSrc, 'init.js'))
    importTpl += `import init from '@/init';\n`
    context.appExportDefault = fn.default;
    if (type(fn.default, 'function')) {
      initTpl += `init && init(vm, Vue);\n`
    }

  }
  
  // 处理 vue option
  let renderComp = '';
  let vueOptions = '';
  // vue render options
  if(appFiles.App){
    importTpl += `import App from '@/App.vue'\n`
    renderComp += '<App></App>';
    vueOptions+= `component: {App},\n`
  } else if (router && appFiles.router){
    importTpl += `import Router from 'vue-router'\n`
    routerTpl +=
      `Vue.use(Router)\n`;
    importTpl += `import routerOption from '@/router/index'\n`
    routerTpl += `let router = new Router(routerOption)\n`
    vueOptions += 'router,\n'
    renderComp += '<router-view></router-view>';
  }else{
    renderComp += `<div>make sure you have <strong>App.vue</strong>  or <strong>router/index.js</strong>  if you turn on router mode</div>`;
  }

  // vue content
  vueTpl +=
    `let vm = new Vue({
  el: '#root',
  ${vueOptions}
  render: h=>{
    return ${renderComp}
  }
})\n`;



  return {
    code: importTpl + routerTpl + vueTpl + reqTpl + initTpl,
    serviceNamespace: context.namespace,
    appExportDefault: context.appExportDefault
  }
}