
let r = new RegExp('\\[object\\s(\\w+)\\]', 'i');

function getType (val) {
  let str = Object.prototype.toString.call(val);
  return str.replace(r, '$1').toLowerCase();
}

function type(val, ...tps) {
  tps = tps.reduce(function (acc,val) {
    return acc.concat(val)
  },[]);

  return tps.some(function(tp) {
    return getType(val) === tp.toLowerCase();
  }) 
}

type.getType = getType

module.exports =type