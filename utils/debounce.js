

exports.exec = function (interval, cb) {
  
  let timer = null;

  return (...rest)=>{
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb(...rest);
    }, interval);
  }
}

exports.cache = function(interval, cb){

  let cacheVal = undefined;

  let timerRunning = false;

  return (fresh, ...rest) => {

    if (fresh) timerRunning = false;

    // 在休息中, 直接缓存并返回新值
    if (!timerRunning){
      timerRunning = true;
      setTimeout(() => {
        timerRunning = false;
      }, interval);

      cacheVal = cb(...rest);
      return cacheVal;
    }else{
      return cacheVal
    }
    
  }
}