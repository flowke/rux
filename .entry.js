import Vue from 'vue/dist/vue.runtime.esm'
import __menu from '@/services/menu.js';
import Request from 'puta';
import * as util from '@/utils/util';
import Router from 'vue-router'
import routerOption from '@/router/index'
Vue.use(Router)
let router = new Router(routerOption)
let vm = new Vue({
  el: '#root',
  router,

  render: h=>{
    return <router-view></router-view>
  }
})
let req = new Request();

window.accs = req;
window.$apis = req.apis;
window.$r = req.mApis;
req.moduleRegister(__menu, 'menu');
window.$util = util
