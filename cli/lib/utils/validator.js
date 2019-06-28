const Ajv = require('ajv');
const path = require('path');
const chalk = require('chalk');
const type = require('../../../utils/type');
let ajv = new Ajv({ 
  allErrors: true,
  jsonPointers: true
});

// https://github.com/epoberezkin/ajv/blob/master/CUSTOM.md#schema-compilation-context
ajv.addKeyword('absolutePath', {
  type: 'string',
  validate: function (schema, str) {
    if(schema===true){
      return path.isAbsolute(str)
    }else{
      return true;
    }
  },
  errors: true
})

ajv.addKeyword('cusType', {
  metaSchema: {
    type: 'string'
  },
  compile: function (schema, str) {

    return function(data){
      return type(data, schema)
    }

  },
  errors: false
})

require('ajv-errors')(ajv, { singleError: true });

// 验证器
module.exports = (schema, data, cb )=>{
  
  let valid = ajv.validate(schema, data);

  if(typeof cb === 'function'){
    cb(!valid? ajv.errors[0]: null, ajv);
  }else{
    if(!valid) {
      let {dataPath, message} = ajv.errors[0];

      let head = ''

      if (typeof cb === 'string') head= cb

      dataPath = dataPath.replace(/\//g, '.')

      console.log();

      console.log(chalk.bold.red((head+' errors:\n').toUpperCase()));
      console.log(chalk.bold.red(head + dataPath + '  ' + message));
      console.log();

      process.exit()
    }
    return true;
  }
}