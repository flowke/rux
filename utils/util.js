
exports.execOnce = function(fn) {
  
  let isExecd = false;

  return function(...rest) {
    if(!isExecd) {
      isExecd = true
      
      fn(...rest)
    } 
  }
}