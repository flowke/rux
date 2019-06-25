import Vue from 'vue/dist/vue.runtime.esm'
import Request from 'puta/lib/index'
import * as serviceCfg from '@/services/config';
import __common from '@@/src/services/common.js';
import __menu from '@@/src/services/menu.js';
import * as util from '@/utils/util'
import Router from 'vue-router'
import routerOption from '@/router/index'
import Vuex from 'vuex'
import storeConfig from '@/store/index'
import __vuex_m_common from '@@/src/store/modules/common.js'
import __vuex_m_home from '@@/src/pages/home/modules/home.js'
import init from '@/init'
let puta = new Request(serviceCfg.options);
window.$req = puta;
window.$apis = puta.apis;
window.$r = puta.mApis;
puta.moduleRegister(__common, 'common');
puta.moduleRegister(__menu, 'menu');
window.$util = util
Vue.use(Router)
Vue.use(Vuex)
storeConfig.modules = {}
storeConfig.modules.common = __vuex_m_common
storeConfig.modules.home = __vuex_m_home
let vm = new Vue({
      el: '#root',
      router: new Router(routerOption),
render: h=>(<router-view></router-view>),
store: new Vuex.Store(storeConfig),

    })
init && init(vm, Vue);
