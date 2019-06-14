

module.exports = {
  libs: {
    vuex: '^3.1.1',
    'vue-router': '^3.0.6',
    
  },

  devLibs: {},

  commonLibs: {
    vue: '^2.6.10',
    puta: 'latest',
    'core-js': '2',
    'core-js': '3',
    '@babel/runtime': 'latest'
  },

  devCommonLibs: {
    "vue-template-compiler": "^2.6.10",
  },

  type: {
    simple: {
      dev: [],
      prod: []
    },
    'router': {
      dev: [],
      prod: ['vue-router']
    },
    'router-vuex': {
      dev: [],
      prod: ['vue-router', 'vuex',]
    },
    'vuex': {
      dev: [],
      prod: ['vuex',]
    },
  }
  
}