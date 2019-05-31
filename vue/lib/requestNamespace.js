const type = require('../../utils/type')

module.exports = function(namespace) {
  let df = {
    requestName: '$req',
    pathNamespace: '$apis',
    moduleNamespace: '$r',
  }
  
  if (type(namespace, 'object')) {
    namespace = Object.assign(df, namespace)
  } else if (type(namespace, 'array')) {
    namespace = {
      requestName: namespace[0] || df.requestName,
      pathNamespace: namespace[1] || df.pathNamespace,
      moduleNamespace: namespace[2] || df.moduleNamespace,
    }
  } else {
    namespace = df
  }

  return namespace;
}

