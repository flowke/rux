const parseNamespace = require('./requestNamespace');
const type = require('../../utils/type')
const createOption = require('../../cli/config/options');
const getAppFiles = require('./mayPath');
const createChunks = require('./chunkBlock/createChunkBlock');
const path = require('path');
module.exports = function create() {

  let {
    request = true,
    router,
    vuex,
    paths: optionsPaths,
    appRoot
  } = createOption();

  let appFiles = getAppFiles(appRoot)
  
  let chunks = createChunks();

  // vue
  chunks.import(`import Vue from 'vue/dist/vue.runtime.esm'`)
 

  let context = {
    appExportDefault: null
  }

  // requset
  if (request) {

    chunks.import(`import Request from 'puta/lib/index'`)

    context.puta = parseNamespace({});
    let optionCode = '';
    if (appFiles.services.config()) {
      delete require.cache[appFiles.services.config('abs')];
      let config = require(appFiles.services.config('abs'));

      context.puta = parseNamespace(config.puta);

      // 如果导出了options
      if (config.options) {
        chunks.import(`import * as serviceCfg from '@/services/config';`)
        optionCode = `serviceCfg.options`
      }

    }
    chunks.code(`let puta = new Request(${optionCode});`)
    chunks.code(`window.${context.puta.instance} = puta;`)
    chunks.code(`window.${context.puta.apis} = puta.apis;`)
    chunks.code(`window.${context.puta.mApis} = puta.mApis;`)

    appFiles.services.apis.forEach(file => {
      chunks.import(`import __${file.name} from '@@/${file.path()}';`)
      chunks.code(`puta.moduleRegister(__${file.name}, '${file.name}');`)
    })

  }


  // utils
  if (appFiles.util()) {
    chunks.import(`import * as util from '@/utils/util'`)
    chunks.code(`window.$util = util`)
  }
  
  // 处理 vue option
  // vue render options
  if(appFiles.App()){
    chunks.import(`import App from '@/App.vue'`)
    chunks.vueOptions('render: h=>(<App></App>),')
    chunks.vueOptions('component: {App},')
  } else if (router && appFiles.router()){
    chunks.import(`import Router from 'vue-router'`)
    chunks.import(`import routerOption from '@/router/index'`)
    chunks.code(`Vue.use(Router)`)
    chunks.code(`let router = new Router(routerOption)`)
    chunks.vueOptions(`router,`)
    chunks.vueOptions(`render: h=>(<router-view></router-view>),`)
    
  }else{
    chunks.vueOptions(`render: h=>(<div>make sure you have <strong>App.vue</strong>  or <strong>router/index.js</strong>  if you turn on router mode</div>),`)
  }

  if(vuex && appFiles.vuex.config()){
    chunks.import(`import Vuex from 'vuex'`)
    chunks.import(`import storeConfig from '@/store/index'`)
    chunks.code(`Vue.use(Vuex)`)
    chunks.code(`storeConfig.modules = {}`)
    chunks.code(`let store = new Vuex.Store(storeConfig);`)
    appFiles.vuex.modules.forEach(m=>{
      chunks.import(`import __vuex_m_${m.name} from '@@/${m.file()}'`)
      chunks.code(`storeConfig.modules.${m.name} = __vuex_m_${m.name}`)
    })

    chunks.vueOptions(`store,`)
  }

  // init file
  if (appFiles.init()) {

    chunks.import(`import init from '@/init'`);

    let ctxCode = '';

    if (router && appFiles.router()) ctxCode += 'router,\n';
    if (vuex && appFiles.vuex.config()) ctxCode += 'store,\n';

    chunks.code(`function doneFN(cb){
      let vm = createVM();
      cb && cb({
        vm,
        ${ctxCode}
      });
    }`)

    chunks.subCode(
      `
      if(init && $util.isType(init, 'function')){

        let argsLength = init.length;

        if(argsLength>=2){
          init(Vue, doneFN)
        }else{
          init(Vue)
          createVM()
        }
      }`
    )

  }else{
    chunks.subCode(`createVM();`);
  }



  return {
    code: chunks.genCode(),
    serviceNamespace: context.namespace,
  }
}