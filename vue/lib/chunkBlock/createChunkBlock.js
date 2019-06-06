

class Block{

  constructor(){
    this.importStr = '';
    this.optStr = '';
    this.codeStr = '';
    this.subCodeStr = '';
  }

  import(str, nl=true){
    this.importStr += str + (nl ? '\n' : '')
  }

  vueOptions(str, nl=true){
    this.optStr += str + (nl ? '\n' : '')
  }

  code(str, nl=true){
    this.codeStr += str + (nl? '\n': '')
  }

  vueIns(){
    return `let vm = new Vue({
      el: '#root',
      ${this.optStr}
    })\n`
  }

  subCode(str, nl = true){
    this.subCodeStr += str + (nl ? '\n' : '')
  }

  genCode(){
    return this.importStr + this.codeStr + this.vueIns() + this.subCodeStr
  }

  
}

module.exports = ()=>new Block()