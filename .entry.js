import Vue from 'vue/dist/vue.runtime.esm'
import Request from 'puta';
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

window.$req = req;
window.$apis = req.apis;
window.$r = req.mApis;
