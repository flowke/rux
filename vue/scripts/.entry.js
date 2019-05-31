import Vue from 'vue/dist/vue.runtime.esm'
import Router from 'vue-router'
import __menu from '@/services/menu.js';
import Request from 'puta';
import * as util from '@/utils/util';
import app from '@/app';
let vm = new Vue({
      el: '#root',
      
      render: h=>{
        return <div>我在这里</div>
      }
    })
    
Vue.use(Router)
let req = new Request();

      window.accs = req;
      window.$apis = req.apis;
      window.$r = req.mApis;
req.moduleRegister(__menu, 'menu');
window.$util = util
app(vm, Vue);
