import Vue from 'vue/dist/vue.runtime.esm'
import __menu from '@@/src/services/menu.js';
import Request from 'puta';
import * as util from '@/utils/util';
let vm = new Vue({
  el: '#root',
  
  render: h=>{
    return <div>make sure you have <strong>App.vue</strong>  or <strong>router/index.js</strong>  if you turn on router mode</div>
  }
})
let req = new Request();

window.accs = req;
window.$apis = req.apis;
window.$r = req.mApis;
req.moduleRegister(__menu, 'menu');
window.$util = util
