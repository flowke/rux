const chokidar = require('chokidar');

const watchers = {};

exports.watch = function (key, paths) {
  if (process.env.WATCH_FILES === 'none') return;

  const watcher = chokidar.watch(paths, {
    ignoreInitial: true,
  });

  watchers[key] = watcher;
  return watcher;
}

exports.unwatch = function unwatch(key) {
 
  
  if (!key) {
    return Object.keys(watchers).forEach(unwatch);
  }
  if (watchers[key]) {
    watchers[key].close();
    watchers[key] = null;
  }
}