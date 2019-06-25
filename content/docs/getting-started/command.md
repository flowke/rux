---
title: Commander
type: docs
---

# 命令行总览

tha 的前置命令只有两个: `tha-r` 和 `tha-v`, 分别针对 react 项目和 vue 项目的操作.

位置参数都一样, 接下的所以接下来的部分将会以 `tha-v` 为例作为演示. 命令的详细内容到各种的板块查看.

## 创建项目 -- init or put

你可以使用 `tha-v init` 或 `tha-v put`, 作为开始来创建项目

### init

```bash
$ tha-v init
```

接着会被提示输入一个项目名字(你也可以在 init 后面紧跟一个名字), 查看如下示例: 

```bash
$ tha-v init
? type a directory name to init: ucs

# 或者直接紧跟一个名字:
# -f 参数用于 ucs 文件夹已经存在的情况, 会强制清空文件夹的内容

$ tha-v init ucs -f
```

`ucs` 在此处将会出现在两个地方: 作为之后项目 package.json 的 name; tha 会新建一个 `ucs` 的文件夹, 之后的项目的模板文件将会放进此处.

在这个动作之后, 你会被提示选择一个项目模板, 你也可以使用 `--type=***` 来直接指定使用哪个模板: 查看如下示例:

```bash
$ tha-v init

? type a directory name to init: ucs

? please choose a template (Use arrow keys)
❯ simple  template will only contain vue
  router  template will contain vue+router
  vuex  template will contain vue+vuex
  router-vuex  template will contain vue+router+vuex

或者直接指定模板:

$ tha-v init ucs --type=simple
```

### put

put 和 init 大同小异, 不同的是 put 会跳过 "输入一个项目名字" 的阶段, 直接把当前文件夹当作项目名.

## 启动项目用于开发: dev

处理确保全局安装了 tha, 还必须确保在项目本地安装 tha, 使用如下命令便可以开启开发服务器:

```bash
$ tha-v dev
```

> 注: 和服务器相关的配置查看 [配置项]({{< ref "/docs/getting-started/config#devserver" >}}) 章节.