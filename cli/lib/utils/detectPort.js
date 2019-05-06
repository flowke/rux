const http = require('http');


function detectPort(port, cb=f=>f) {
  let server = http.createServer();
  server.once('error', err => {
    console.log('innn ');
    
    if (err.code === 'EADDRINUSE') {
      
      setTimeout(() => {
        
        server.close();
        detectPort(port+1, cb);
      }, 30);
    } else {

      if (cb) {
        cb(err, null);
      } else {
        server.close();
        throw new Error('detect port fail, retry...');
      }
    }
  });

  server.listen(port, () => {
    console.log('pppp');
    
    server.close();
    cb(null, port);
  });
  
}

module.exports = function(port) {
  return new Promise((rv, rj) => {
    detectPort(port, (err, port)=>{
      
      if(err) rj(err);
      rv(port);
    })
  });
}