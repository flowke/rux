import Vue from 'vue/dist/vue.runtime.esm';
import * as serviceCfg from '@/services/config';
import __app from '@/services/app.js';
import Request from 'puta';
import * as util from '@/utils/util';
import app from '@/app';
let vm = new Vue({
  el: '#root',
  render: h=>{
    return <div>我在这里</div>
  }
})

let req = new Request(serviceCfg.options);

    window.$req = req;
    window.$apis = req.apis;
    window.$r = req.mApis;
    
req.moduleRegister(__app, 'app');
window.$util = util
app(vm);
