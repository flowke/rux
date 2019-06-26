const build = require('../../cli/scripts/vueBuild');

const emitEntry = require('../lib/emitEntry');
const createOption = require('../../cli/config/options');

emitEntry()
.then(()=>{
  createOption.update()
  build()
})

