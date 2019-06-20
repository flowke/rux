

module.exports = function ordered(arr, op={}){
  let { paraller, beforeEach, afterEach, waitingEach } = op;

  let p = Promise.resolve(true);

  if (paraller){
    arr = arr.map(fn=>{
      
      let out = fn()
      beforeEach && beforeEach(out.info)
      return () => out
    })
  }

  return arr.reduce((acc, fn, i)=>{


    return acc.then(()=>{
      let out = fn();
      if(!paraller){
        beforeEach && beforeEach(out.info)
      }
      waitingEach && waitingEach(out.info)
      return out
    })
    .then(res=>{
      afterEach && afterEach(res)
      return res
    })
  }, p)

}
