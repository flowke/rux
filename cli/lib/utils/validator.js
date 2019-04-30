const Ajv = require('ajv');


module.exports = (schema, data, cb=f=>f )=>{
  let ajv = new Ajv();

  let valid = ajv.validate(schema, data);

  if(typeof cb === 'function'){
    cb(valid? ajv.errors: null, ajv);
  }else{
    if(!valid) throw ajv.errors
  }
}