


let envs = {
  NODE_ENV: process.env.NODE_ENV || 'production',

}

module.exports = env

exports.stringified = Object.keys(envs).reduce((env, key) => {
  env[key] = JSON.stringify(envs[key]);
  return env;
}, {})