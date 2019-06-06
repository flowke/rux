const type = require('../../utils/type')

module.exports = function(namespace) {
  let df = {
    instance: '$req',
    apis: '$apis',
    mApis: '$r',
  }
  
  if (type(namespace, 'object')) {
    namespace = Object.assign(df, namespace)
  } else if (type(namespace, 'array')) {
    namespace = {
      instance: namespace[0] || df.instance,
      apis: namespace[1] || df.apis,
      mApis: namespace[2] || df.mApis,
    }
  } else {
    namespace = df
  }

  return namespace;
}

