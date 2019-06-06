const block = require('./createChunkBlock');


let chunks = {
  puta: block(),
  vuex: block(),
  router: block(),
  util: block(),
  init: block(),
  App: block(),
  vue: block()
}

chunks.vue.opsChunk = ''
chunks.vue.injectOption = function(str){
  this.opsChunk += str
  // console.log(this.opsChunk, 'this.opsChunk')
}

chunks.vue.genOptionsCode = function(){
  this.codeStr += `let vm = new Vue({
      el: '#root',
      ${this.opsChunk}
    })
  `
}

chunks.generate = ()=>{

  let val = ['util','router', 'router', 'App', 'vue', 'puta',  'init'  ].reduce((acc, key)=>{
    let val = chunks[key];

    chunks.vue.injectOption(val.optStr)

    if (key === 'vue') chunks.vue.genOptionsCode()
    // console.log(val);
    
    acc.import += val.importStr;
    acc.code += val.codeStr;
    

    return acc

  }, {
    import: '',
    code: ''
  })

  return val.import + val.code

}


module.exports = chunks
