# 前端脚手架之基础原理

![](/images/docs/cli-principle-main.png)

> 前言：在不同项目获多人协作的开发过程中，一些重复执行的工作能够通过前端脚手架自动化地完成，从而提高了研发效率；同时前端脚手架也能够将这些重复执行的工作建立一套标准的规范，从而实现了研发的一致性。本文主要介绍了前端脚手架的基础原理（包括安装过程和执行过程），以便帮助前端工程师更好地理解和开发脚手架工具。

## 1. 序言

在 [Web 前端架构师](https://class.imooc.com/sale/fearchitect)中认为能够回答以下 3 个问题，就掌握了脚手架的实现原理：

1. 为什么全局安装脚手架后会添加一个能够全局执行的命令?
2. 全局安装脚手架时发生了什么？
3. 执行脚手架命令时发生了什么？

总结这三个问题其实就是搞清楚两个阶段，一个是脚手架安装阶段，另一个是脚手架执行阶段。因此，本文就主要围绕安装和执行这两个阶段来介绍脚手架基础原理，同时结合 [@vue/cli](https://github.com/vuejs/vue-cli) 案例进行说明。

::: warning

注意，当前 [@vue/cli](https://github.com/vuejs/vue-cli) 已不再推荐使用，官方推荐使用 [create-vue](https://github.com/vuejs/create-vue) 来创建 Vue 项目。尽管 [@vue/cli](https://github.com/vuejs/vue-cli) 已不再推荐使用，但是其仍旧不失为一个优秀的学习示例。

:::

## 2. 脚手架安装

执行脚手架安装命令后究竟发生了什么 ❓

1. 安装依赖包到`node` 的`lib/node_modules`下；
2. 解析`package.json `内容，如果存在`bin`字段，则根据`bin`字段的内容在 `node` 的 `bin` 目录下配置软链接，格式为`软链接名称：实际指向内容`。注意，我们实际使用的命令就是`bin`字段下设置的软链接名称，而非依赖包名字。

🔎 示例：安装 `npm i -g @vue/cli`后，其 package.json 中存在 bin 字段如下，则创建对应的软连接：

```json
{
  "bin": {
    "vue": "bin/vue",
    "vue-init": "bin/vue-init",
    "vue-list": "bin/vue-list"
  }
}
```

![](/images/docs/cli-link.png)

:::tip 执行 npm init vue@latest 又发生了什么？

npm init vue 等价于 npm exec create-vue，这个命令允许你从 npm 包（本地或远程）中运行任意命令，详见 [npm 官方文档](https://docs.npmjs.com/cli/v7/commands/npm-init)。因此，我们全局安装 `npm i -g create-vue`，然后执行对应命令`create-vue`，也是同样的效果。

:::

## 3. 脚手架执行

### 3.1 执行命令

格式如下：

```
主命令 命令 命令参数 选项 选项参数
```

示例如下：

```shell
vue create my-demo --force -r https://registry.npm.taobao.org # 简写
vue create my-demo --force true --registry https://registry.npm.taobao.org # 完整
```

::: tip 说明

1.  --force 完整写法应该是 --force true；-r 为缩写，完整为 --registry。
2.  主命令即[脚手架安装](#_2-脚手架安装)中所说的`bin`字段下设置的软链接名称，而非依赖包名字。

:::

### 3.2 执行原理

以 [@vue/cli](https://github.com/vuejs/vue-cli) 创建项目为例：

1. 在终端输入命令`vue create my-demo`
2. 终端解析主命令为`vue`，在环境变量中找到`vue`命令（相当于终端执行`which vue`）
3. 终端根据`vue`命令链接到实际文件`vue.js`
4. 终端利用`node`执行`vue.js`
5. `vue.js`解析 command/options
6. `vue.js`执行 command/options

![](/images/docs/cli-process.png)

::: tip 如何找到 vue 命令对应的可执行文件 ❓

首先在终端执行`which vue`并根据结果进入对应文件所在的目录，然后在终端执行`ls -alF`，从结果可以看到 vue 命令对应的是一个软连接，实际指向的是`../lib/node_modules/vue-cli/bin/vue`，这就是我们最终执行的文件。

![](/images/docs/which-vue.png)

:::

::: tip 可执行文件是如何通过 node 执行的 ❓

打开可执行文件我们可以在顶部看到这样一行代码`#!/usr/bin/env node`，这表示从环境变量中找 node 然后通过 node 来执行这个文件。注意不要写成`#!/usr/bin/node` ，这种写法是固定了 node 的路径，但是每个人电脑安装的路径是不一定的，我们应该从环境变量里去找 node 路径。

```js
#!/usr/bin/env node
```

:::
