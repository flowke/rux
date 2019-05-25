function type(val, tp){
  return Object.prototype.toString.call(val) === `[object ${tp}]`
}

function mobj(o1,o2){
  for (const key in o2) {
    if (o2.hasOwnProperty(key)) {
      const elt = o2[key];

      if (type(elt, 'Object') && type(o1[key],'Object')) {
        o1[key] = mobj(o1[key], elt);
      } else if (type(elt, 'Array') && type(o1[key], 'Array')) {
        o1[key] = o1[key].concat(elt);
      }else{
        o1[key] = elt;
      }
    }
  }
  return o1
}

module.exports = function merge(...objs){
  return objs.reduce((accu, elt)=>{
    return mobj(accu, elt)
  },{})
}