
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
  },
  paths: {
    outputPath: './dist',
    publicPath: '',
    // 单页的 html 模板
    appHtml: './src/index.html',
    //  app 文件夹
    assetsDir: 'static',
    hash: false,
    contentHash: true,
    js: '',
    css: '',
    fonts: '',
    img: '',
    media: '',
    'otherFiles': '',
    patterns: []
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

参考: [devServer](https://webpack.js.org/configuration/dev-server/)

```js
devServer: {
  port: 4050
},
```

## paths

`object, defaults: {}`

此配置项用于 配置和文件路径相关的选项, 例如 输出目录, 文件位置等等.

以下是一个配置项示例: 


```js
{
  paths: {
    outputPath: './dist',
    publicPath: '',
    // 单页的 html 模板
    appHtml: './src/index.html',
    //  app 文件夹

    assetsDir: 'static',
    hash: false,
    contentHash: true,
    js: '',
    css: '',
    fonts: '',
    img: '',
    media: '',
    'otherFiles': '',
    patterns: []
  }
}


```

### paths.outputPath

`string, default: 'dist'`

相当于定义 webpack 配置的 output.path, 此处可以是相对路径或绝对路径.

### paths.publicPath

`string, default: ''`

相当于定义 webpack 配置的 output.publicPath.

### paths.appHtml

`string, default: './src/index.html'`

相当于定义 html-webpack-plugin` 的 template`.


### paths.assetsDir

`string, default: 'static'`

放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputPath 的) 目录。

### paths.contentHash

`string / boolean, default: true`

配置 输出文件名的 contentHash 格式,  

- false 为不生成 contenthash.  
- true 为 "[contenthash:8]"
- string, 自定义 contenthash 的格式, 参考: [webpack output.filename](https://webpack.js.org/configuration/output/#outputfilename)

### paths.hash

`string / boolean, default: false`

配置 输出文件名的 hash 格式, **只在 contentHash 为 false 时生效**.

- false 为不生成 hash.  
- true 为 "[hash:8]"
- string, 自定义 contenthash 的格式, 参考: [webpack output.filename](https://webpack.js.org/configuration/output/#outputfilename)


### paths.js

`string, default: ''`

定义 js 文件的输出.

值示例: `static/js/[name].[contenthash:8].js`

相当于配置 webpack 的 output.filename 和 output.chunkFilename. 对此配置有影响.

string 的格式符合 webpack output.filename 的格式, 不过此处设置的 .js 后缀会被忽略.

假定值为: `'static/js/[name].[contenthash:8].js'`, 对 webpack 产生的影响如下: 

```js
{
  output: {
    filename: 'static/css/[name].[contenthash:8].css',
    chunkFilename: 'static/css/[name].[contenthash:8].[id].chunk.css',
  }
}

```

 参考: [webpack output.filename](https://webpack.js.org/configuration/output/#outputfilename)

 > 此配置会忽略 assetsDir, hash , contenthash 配置

### paths.css

`string, default: ''`

定义 css 文件的输出.

值示例: `static/css/[name].[contenthash:8].css`

相当于配置 [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) 的 filename 和 chunkFilename

string 的格式符合 mini-css-extract-plugin option.filename 的格式, 不过此处设置的 .css 后缀会被忽略.

假定值为: `'static/js/[name].[contenthash:8].css'`, 对mini-css-extract-plugin影响如下: 

```js
{
  filename: 'static/js/[name].[contenthash:8].js',
  chunkFilename: 'static/js/[name].[contenthash:8].[id].chunk.js',
}

```

参考: [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

 > 此配置会忽略 assetsDir, hash , contenthash 配置

### paths.img

`string, default: ''`

值示例: `static/img/[name].[contenthash:8].[ext]`

定义图片文件的输出位置, 影响的文件为: `.bmp, .gif, .jpg, .jpeg, .png`

 > 此配置会忽略 assetsDir, hash , contenthash 配置

### paths.fonts

`string, default: ''`

值示例: `static/fonts/[name].[contenthash:8].[ext]`

定义字体文件的输出位置, 影响的文件为: `.ttf, .eot, .woff, .woff2`

 > 此配置会忽略 assetsDir, hash , contenthash 配置

### paths.media

`string, default: ''`

值示例: `static/media/[name].[contenthash:8].[ext]`

定义音频视频文件的输出位置, 影响的文件为: `.avi、.mpeg、.mp4、.mov、.mkv、.wmv、.flv、.rmvb、.webm, .mp3, .ogg, .wav`

 > 此配置会忽略 assetsDir, hash , contenthash 配置

### paths.otherFiles

`string, default: ''`

值示例: `static/other-files/[name].[contenthash:8].[ext]`

定义其它 **未在以上标明的文件** 的输出位置, 例如 `ab.abc` 文件后缀名未在以上识别, 打包出来的文件将放在 static/other-files/ 文件夹下.

 > 此配置会忽略 assetsDir, hash , contenthash 配置

### paths.patterns

`array< array<array|string|regexp, string> >, default: []`

patterns 是一个数组, 每一个元素也是一个数组, 

值示例: 

```js
[
  // 第一个元素 为匹配条件, 可以是 array, string, regexp
  // 第二个元素是文件位置
  [/\.abc$/, 'static/abc/[name].[hash].[ext]'],
  [[/\.aaa$/, /\.bbb$/], 'static/abab/[name].[hash].[ext]'],
]

```

在以上示例的情况下,   

- `.abc` 后缀的文件将放在 `static/abc/` 文件夹下,   
- `.aaa, .bbb` 后缀的文件将放在 `static/abab` 文件夹下

### 注意 :key::key:

 paths 的 img, fonts, media, otherFiles, patterns, 的文件名需符合 [file-loader option.name](https://github.com/webpack-contrib/file-loader#name) 的要求, 参考: [file-loader](https://github.com/webpack-contrib/file-loader#name)

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