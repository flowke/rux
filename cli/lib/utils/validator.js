const Ajv = require('ajv');
const path = require('path');


let ajv = new Ajv({ allErrors: true});
require('ajv-errors')(ajv, { singleError: false});

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

// 验证器
module.exports = (schema, data, cb )=>{
  

  let valid = ajv.validate(schema, data);

  if(typeof cb === 'function'){
    cb(!valid? ajv.errors[0]: null, ajv);
  }else{
    if(!valid) {
      let {dataPath, message} = ajv.errors[0];
      
      throw new Error(`${dataPath} ${message}`)
    }
    return true;
  }
}