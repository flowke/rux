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
    namespace = Object.assign({
      requestName: namespace[0],
      pathNamespace: namespace[1],
      moduleNamespace: namespace[2],
    }, dfRequest)
  } else {
    namespace = df
  }

  return namespace;
}

