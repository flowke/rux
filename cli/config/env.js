

let envs = {
  NODE_ENV: process.env.NODE_ENV || 'production',

}

const stringified = envs => {
  return Object.keys(envs).reduce((env, key) => {
    env[key] = JSON.stringify(envs[key]);
    return env;
  }, {})
}

module.exports = {row: envs, stringified}

