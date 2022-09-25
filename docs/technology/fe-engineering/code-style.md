# 前端统一代码规范指南

![](/images/docs/code-style-main.png)

> 前言：本文主要介绍了使用 ESLint、Prettier、StyleLint、lint-staged 和 husky 等工具统一代码风格；使用 commitizen 和 cz-customizable 等工具规范 commit message；VSCode 插件和 EditorConfig 配置等内容。代码地址 👉 [vue3-project-startkit](https://github.com/sherwinshen/vue3-project-startkit)

## 1. 编辑器配置

### 1.1 VSCode 配置

![VSCode配置方式](/images/docs/vscode-setting.png)

所有 VSCode 配置自定义的内容（包括插件部分）都在 setting.json 文件中，以下为参考配置：

```json
{
  "editor.tabSize": 2,
  "window.zoomLevel": 0,
  "editor.fontSize": 14,
  "editor.formatOnPaste": true,
  "editor.formatOnSave": true,
  "editor.multiCursorModifier": "ctrlCmd",
  "editor.snippetSuggestions": "top",
  "eslint.codeAction.showDocumentation": {
    "enable": true
  },
  "eslint.run": "onSave",
  "eslint.format.enable": true,
  "eslint.options": {
    "extensions": [".js", ".vue", ".ts", ".tsx"]
  },
  "eslint.validate": ["javascript", "typescript", "vue"],
  "stylelint.validate": ["css", "less", "postcss", "scss", "sass", "vue"],
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.fixAll.eslint": true
  },
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 2000
}
```

::: tip 参考资料

- [VS Code 使用指南](https://github.com/qianguyihao/Web/blob/master/00-%E5%89%8D%E7%AB%AF%E5%B7%A5%E5%85%B7/01-VS%20Code%E7%9A%84%E4%BD%BF%E7%94%A8.md)
- [VS Code 中 Vetur 与 prettier、ESLint 联合使用](https://www.cnblogs.com/jeffhong99/p/13367551.html)

:::

### 1.2 EditorConfig 配置

[EditorConfig](https://editorconfig.org/) 的优先级高于编辑器自身的配置，因此可用于维护不同开发人员、不同编辑器的编码风格。在项目根目录下增加 .editorconfig 文件进行配置即可，以下为参考配置：

```
# Editor configuration, see http://editorconfig.org

# 表示是最顶层的 EditorConfig 配置文件
root = true

[*] # 表示所有文件适用
charset = utf-8 # 设置文件字符集为 utf-8
indent_style = space # 缩进风格（tab | space）
indent_size = 2 # 缩进大小
end_of_line = lf # 控制换行类型(lf | cr | crlf)
insert_final_newline = true # 始终在文件末尾插入一个新行
trim_trailing_whitespace = true # 去除行尾的任意空白字符
```

## 2. 代码格式化

### 2.1 工具介绍

![](/images/docs/code-style-plugin.png)

- [ESLint](https://eslint.org/) 是一款用于查找并报告代码中问题的工具
- [Stylelint](https://stylelint.io/) 是一个强大的现代 CSS 检测器
- [Prettier](https://prettier.io/) 是一款强大的代码格式化工具，支持多种语言
- [lint-staged](https://github.com/okonet/lint-staged) 是一个在 git 暂存文件上运行 linters 的工具
- [husky](https://typicode.github.io/husky/#/) 是 Git Hook 工具，可以设置在 git 各个阶段触发设定的命令

### 2.2 配置说明

::: warning 注意

随着工具的迭代与更新，下列配置方法可能会有所变化，一切以官方文档为准！

:::

#### 2.2.1 ESLint 配置

```shell
npm i -D eslint eslint-plugin-vue eslint-plugin-import eslint-import-resolver-typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-plugin-prettier eslint-config-prettier
```

在项目根目录下增加 .eslintrc.js 文件进行配置即可，配置项详见[官方文档](http://eslint.cn/docs/user-guide/configuring)，以下为参考配置：

```js
module.exports = {
  // 此项是用来告诉 eslint 找当前配置文件不能往父级查找
  root: true,
  // 全局环境
  env: {
    browser: true,
    node: true,
  },
  // 指定如何解析语法，eslint-plugin-vue 插件依赖vue-eslint-parser解析器
  parser: "vue-eslint-parser",
  // 优先级低于parse的语法解析配置
  parserOptions: {
    // 指定ESlint的解析器
    parser: "@typescript-eslint/parser",
    // 允许使用ES语法
    ecmaVersion: 2020,
    // 允许使用import
    sourceType: "module",
    // 允许解析JSX
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    "eslint:recommended", // 引入 ESLint的核心功能并且报告一些常见的共同错误
    "plugin:import/recommended", // import/export语法的校验
    "plugin:import/typescript", // import/export 语法的校验（支持 TS）
    // 'plugin:vue/essential' // vue2 版本使用
    // 'plugin:vue/recommended', // vue2 版本使用
    "plugin:vue/vue3-essential", // vue3 版本使用
    "plugin:vue/vue3-recommended", // vue3 版本使用
    "plugin:@typescript-eslint/recommended",
    "prettier", // prettier 要放在最后！
  ],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-undef": "off",
    // 更多规则详见：http://eslint.cn/docs/rules/
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
```

注意点 1，要在 tsconfig.json 中进行如下配置，否则别名 @ 会出现报错

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

注意点 2，当 ESLint 同时使用 prettier 时，prettier 和 ESLint 可能存在一些规则冲突，需要借助 [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) 和 [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) 进行解决，在安装完依赖包后在 .eslintrc.js 配置文件中添加相应内容。

```js
module.exports = {
  extends: [
    // 其他扩展内容...
    "prettier", // prettier 要放在最后！
  ],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
  },
};
```

#### 2.2.2 StyleLint 配置

```shell
npm i -D stylelint stylelint-config-standard stylelint-order stylelint-config-rational-order prettier stylelint-prettier stylelint-config-prettier postcss-html postcss-less stylelint-config-recommended-vue
```

在项目根目录下增加 .stylelintrc.js 文件进行配置即可，配置项详见[官方文档](https://stylelint.io/user-guide/configure)，以下为参考配置：

```js
module.exports = {
  extends: [
    "stylelint-config-standard", // 官方 stylelint 规则
    "stylelint-config-rational-order", // 属性排列顺序规则
    "stylelint-prettier/recommended",
    "stylelint-config-recommended-vue",
  ],
  rules: {
    // 更多规则详见：https://stylelint.io/user-guide/rules/list
  },
};
```

注意，当同时使用 prettier 和 StyleLint 时，两者可能存在一些规则冲突，需要借助 [stylelint-prettier](https://github.com/prettier/stylelint-prettier) 和 [stylelint-config-prettier](https://github.com/prettier/stylelint-config-prettier) 进行解决，安装完依赖包后在 .stylelintrc.js 配置文件中添加相应内容。

```js
module.exports = {
  extends: [
    /*
     * 通过安装 stylelint-prettier，设置 'stylelint-prettier/recommended'，其包含了三个操作
     * plugins: ['.'],
     * extends: ['stylelint-config-prettier'], // 需要安装 stylelint-config-prettier
     * rules: {'prettier/prettier': true},
     */
    "stylelint-prettier/recommended",
  ],
};
```

#### 2.2.3 Prettier 配置

```shell
npm i -D prettier
```

在项目根目录下增加 .prettierrc.js 文件进行配置即可，配置项详见官方文档，以下为参考配置：

```js
module.exports = {
  // 更多规则详见：https://prettier.io/docs/en/options.html
  printWidth: 120, // 单行长度
  tabWidth: 2, // 缩进长度
  useTabs: false, // 使用空格代替tab缩进
  semi: true, // 句末使用分号
  singleQuote: true, // 使用单引号
  bracketSpacing: true, // 在对象前后添加空格-eg: { foo: bar }
  quoteProps: "consistent", // 对象的key添加引号方式
  trailingComma: "all", // 多行时尽可能打印尾随逗号
  jsxBracketSameLine: true, // 多属性html标签的‘>’折行放置
  arrowParens: "always", // 单参数箭头函数参数周围使用圆括号-eg: (x) => x
  jsxSingleQuote: true, // jsx中使用单引号
  proseWrap: "preserve",
  htmlWhitespaceSensitivity: "ignore", // 对HTML全局空白不敏感
};
```

#### 2.2.4 husky 和 lint-staged 配置

Step1. 初始化 husky

```shell
npx husky-init && npm install
```

Step2. 在 .husky/pre-commit 文件中进行修改（注意 husky@7 区别于 husky@4 的设置方式）

```shell
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

Step3. 安装 lint-statged 并在 package.json 中进行设置

```shell
npm i -D lint-staged
```

```json
{
  "lint-staged": {
    "*.{js,ts,vue}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ],
    "*.{css,less,vue}": [
      "stylelint --fix",
      "prettier --write",
      "git add"
    ]
  }
}
```

### 2.3 使用参考

1. 代码提交：根据上述工具配置，代码在提交仓库时进行检查和格式化，实现代码风格统一
2. 本地保存：根据 VS Code 配置，使得代码在保存的时候即按照相应的规则进行格式化

## 3. Commit Message 格式化

### 3.1 工具介绍

[约定式提交规范](https://www.conventionalcommits.org/zh-hans/)是用于给提交信息增加人机可读含义的规范，其可通过以下工具检查、统一和格式化：

- [commitlint](https://github.com/conventional-changelog/commitlint)：检查您的提交消息是否符合 conventional commit format
- [commitizen](https://github.com/commitizen/cz-cli)：帮助撰写规范 commit message 的工具
- [cz-customizable](https://github.com/leoforfree/cz-customizable)：自定义配置 commitizen 工具的终端操作
- [commitlint-config-cz](https://github.com/whizark/commitlint-config-cz)：合并 cz-customizable 的配置和 commitlint 的配置

### 3.2 配置说明

::: warning 注意

随着工具的迭代与更新，下列配置方法可能会有所变化，一切以官方文档为准！

:::

#### 3.2.1 格式化配置

Step1. 安装 commitizen 和 cz-customizable

```shell
npm install -D commitizen cz-customizable
```

Step2. 在 package.json 添加以下内容（非全局安装的时候）：

```json
{
  "config": {
    "commitizen": {
      "path": "node_modules/cz-customizable"
    }
  }
}
```

Step3. 在项目根目录下增加 .cz-config.js 文件进行配置即可，以下为参考配置：

```javascript
module.exports = {
  // type 类型
  types: [
    { value: "feat", name: "feat: 新增功能" },
    { value: "fix", name: "fix: 修复 bug" },
    { value: "docs", name: "docs: 文档变更" },
    { value: "style", name: "style: 代码格式改变（不影响功能）" },
    { value: "refactor", name: "refactor: 代码重构（不包括 bug 修复、功能新增）" },
    { value: "perf", name: "perf: 性能优化" },
    { value: "test", name: "test: 添加或修改测试用例" },
    { value: "build", name: "build: 构建流程或外部依赖变更" },
    { value: "ci", name: "ci: 修改 CI 配置或脚本" },
    { value: "chore", name: "chore: 对构建过程或辅助工具和库的更改（不影响源文件、测试用例）" },
    { value: "revert", name: "revert: 回滚 commit" },
  ],
  // scope 类型
  scopes: [
    { name: "components" },
    { name: "hooks" },
    { name: "utils" },
    { name: "styles" },
    { name: "deps" },
    // { name: 'custom' }, // 如果选择 custom，后面会让你再输入一个自定义的 scope。也可以不设置此项，把后面的 allowCustomScopes 设置为 true
  ],
  allowCustomScopes: true,
  // 交互提示信息
  messages: {
    type: "确保本次提交遵循 Angular 规范！\n选择你要提交的类型：",
    scope: "选择一个 scope（可选）：\n",
    customScope: "请输入自定义的 scope：\n", // 选择 scope: custom 时会出现的提示
    subject: "填写简短精炼的变更描述：\n",
    body: '填写更加详细的变更描述（可选）。使用 "|" 换行：\n',
    breaking: "列举非兼容性重大的变更（可选）：\n",
    footer: "列举出所有变更的 ISSUES CLOSED（可选）：\n",
    confirmCommit: "是否确认提交？",
  },
  // 设置只有 type 选择了 feat 或 fix，才询问 breaking message
  allowBreakingChanges: ["feat", "fix"],
  // subject 限制长度
  subjectLimit: 100,
};
```

Step4. 新增 husky 配置，使得提交 commit message 时触发 commitizen，快捷命令如下：

```shell
npx husky add .husky/prepare-commit-msg "exec < /dev/tty && node_modules/.bin/cz --hook || true"
```

注意，commitizen 如果是全局安装，则使用下面的快捷命令：

```shell
npx husky add .husky/prepare-commit-msg "exec < /dev/tty && git cz --hook || true"
```

#### 3.2.2 格式检查配置

Step1. 安装 commitlint 和 commitlint-config-cz 依赖

```shell
npm install --save-dev @commitlint/{config-conventional,cli} commitlint-config-cz
```

Step2. 在项目根目录下增加 commitlint.config.js 文件进行配置即可，以下为配置内容：

```js
module.exports = {
  extends: ["@commitlint/config-conventional", "cz"],
  rules: {},
};
```

Step3. 新增 husky 配置，使得提交 commit message 时触发 commitlint 检验，配置内容如下：

```shell
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

### 3.3 使用参考

在命令行输入 git commit，然后根据命令行提示输入相应的内容即可。

## 4. 代码规范参考

### 4.1 JS/TS 规范

社区类代码风格：

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Clean Code Javascript](https://github.com/ryanmcdermott/clean-code-javascript)
- [Code Guide by @AlloyTeam](http://alloyteam.github.io/CodeGuide/)
- [JavaScript Standard Style](https://github.com/standard/standard)

工具类代码风格：

- [ESLint 规则](https://eslint.cn/docs/rules/)
- ESLint 扩展：
  - [eslint-plugin-vue](https://eslint.vuejs.org/)（针对 Vue2/3 规则）
  - [eslint-config-standard](https://www.npmjs.com/package/eslint-config-standard)（对应 JavaScript Standard Style 社区规则）
  - [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb)（对应 Airbnb JavaScript Style Guide 社区规则）

### 4.2 CSS 规范

社区类代码风格：

- BEM 规范：[GetBEM](http://getbem.com/) / [CSS BEM 书写规范](https://github.com/Tencent/tmt-workflow/wiki/%E2%92%9B-%5B%E8%A7%84%E8%8C%83%5D--CSS-BEM-%E4%B9%A6%E5%86%99%E8%A7%84%E8%8C%83)
- [谷歌 CSS 规范](https://google.github.io/styleguide/htmlcssguide.html)

工具类代码风格

- [stylint 规则](https://stylelint.io/user-guide/rules/list)
- [csscomb 规则](https://github.com/csscomb/csscomb.js/tree/dev/config)

### 4.3 VUE 规范

推荐阅读官方文档 - [风格指南](https://cn.vuejs.org/style-guide/#style-guide)和官方维护的代码规范插件 - [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue)
