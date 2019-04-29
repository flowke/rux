const pnp = require('pnp-webpack-plugin');


class ruxModuleLoader {
  constructor(module){
    this.module = module;
  }
  apply(resolver) {
    pnp.moduleLoader(this.module).apply(resolver)
  }
}

pnp.ruxModuleLoader = ruxModuleLoader;

module.exports = pnp;