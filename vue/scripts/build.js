const build = require('../../cli/scripts/vueBuild');
// const path = require('path');
const emitEntry = require('../lib/emitEntry');
// const op = require('../../cli/config/options');

// const rimraf = require('rimraf');

emitEntry()
.then(()=>{
  build()
})

