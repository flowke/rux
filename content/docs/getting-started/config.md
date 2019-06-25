
# 通用配置项

项目的配置文件位于: `config/config.js`, 以下是一个示例:

```js
module.exports = {
  devServer: {
    port: 3006
  },
  clientEnv: {
    // access it with process.env.BUILD_TYPE
    BUILD_TYPE: 'test'
  },
  globalVar: {
    // access it with NAME
    NAME: 'Hue'
  },
  compatibility: {
    level: , //0,1,2

    // targets config for browserslist
    // https://github.com/browserslist/browserslist
    targets: {
      "chrome": "58",
      "ie": "11"
    }
  }
}
```

以下配置是通用的:

## puta

`boolean, defaults: true`

是否内置 [`puta`](https://www.npmjs.com/package/puta) 用于请求. 

## devServer

* type: `Object`

此配置项内容等同于 webpack 的 devServer 的配置内容. 如下配置会修改开发服务器的启动端口为4050:

```js
devServer: {
  port: 4050
},
```

## clientEnv

* type: `Object`

在项目可以通过 `process.env.xxx` 来访问 clientEnv 定义的内容:


```js
clientEnv: {
  BUILD_TYPE: 'client'
},
```

## globalVar

* type: `Object`

可以定义一些全局变量, 在项目中可以访问: 

```js
globalVar: {
  BUILD_TYPE: 'client'
},
```

## compatibility

* type: `Object`

用于定义项目代码的兼容性, 查看如下说明: 

```js
compatibility: {
  level: , //0,1,2

  // targets config for browserslist
  // https://github.com/browserslist/browserslist
  targets: {
    "chrome": "58",
    "ie": "11"
  }
},
```

**level:**

类型: `Number`  
可选值: 0,1,2  
默认值: 0  
 
- 0 不进行 polyfill, 
- 1 进行 polyfill, 
- 2 polyfill 会包括实例属性, 例如: `"foobar".includes("foo")`


**targets**

`string | Array<string> | { [string]: string }, defaults to {}.`

定义兼容的目标, 详情查看 https://github.com/browserslist/browserslist

这决定了 babel 是否需要都某些代码进行 transform 和 polyfill.