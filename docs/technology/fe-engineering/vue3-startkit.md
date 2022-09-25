# 前端 Vue3 项目搭建指南

![](/images/docs/vue3-startkit-main.png)

> 前言：本文主要详细介绍了基于 Vue3 技术栈初始化前端项目的完整流程，包含框架搭建、代码规范、单元测试和自动部署等内容。代码地址 👉 [vue3-project-startkit](https://github.com/sherwinshen/vue3-project-startkit)

## 1. 架构搭建

### 1.1 技术选型

![](/images/docs/vue3-kit.png)

- 编程语言：[TypeScript 4.x](https://www.typescriptlang.org/)
- 前端框架：[Vue 3.x](https://v3.cn.vuejs.org/)
- 构建工具：[Vite 2.x](https://vitejs.dev/)
- CSS 相关：[Less](https://lesscss.org/) + [Tailwind CSS](https://tailwindcss.com/)
- 路由工具：[Vue Router 4.x](https://next.router.vuejs.org/index.html)
- 状态管理：[Pinia](https://pinia.vuejs.org/)
- HTTP 工具：[Axios](https://axios-http.com/)
- UI 框架：[Element Plus](https://element-plus.gitee.io/zh-CN/)
- 单元测试：[Vitest](https://cn.vitest.dev)

### 1.2 项目初始化

运行 `npm init vite@latest`，选择 vue + vue-ts，即创建初始项目完毕。

#### 1.2.1 Less 安装配置

Step1. 运行`npm i less less-loader -D`安装 less 和 less-loader

Step2. 在文件`vite.config.js`中配置全局变量等公共内容

```javascript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "${resolve(__dirname, "src/assets/styles/common/index.less")}";`, // 引入公共内容
      },
    },
  },
});
```

#### 1.2.2 Tailwind CSS 安装配置

安装步骤详见 👉 [官网](https://tailwindcss.com/docs/guides/vite)。

#### 1.2.3 Vue-Router 安装配置

Step1. 运行 `npm install vue-router@4` 安装 vue-router

Step2. 创建 `src/router/handlers.ts` 路由守卫文件，见下

```typescript
import { RouteLocationNormalized, NavigationGuardNext } from "vue-router";

export const beforeEachHandler = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  // ...
  next();
};
```

Step3. 创建 `src/router/index.ts` 路由配置文件，见下

```typescript
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { beforeEachHandler } from "@/router/handlers";

const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
  },
] as RouteRecordRaw[];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach(beforeEachHandler);

export default router;
```

#### 1.2.4 Pina 安装配置

Step1. 运行`npm install pinia`安装 pinia

Step2. 在`main.ts`文件中引入 pinia

```typescript
import { createPinia } from "pinia";

app.use(createPinia());
```

Step3. 创建内容举例如下

```typescript
// @/stores/counter.ts

import { defineStore } from "pinia";

export interface State {
  count: number;
}

export const useCounterStore = defineStore({
  id: "count",
  state: (): State => ({
    count: 0,
  }),
  getters: {
    doubleCount(state: State) {
      return 2 * state.count;
    },
  },
  actions: {
    increment() {
      this.count++;
    },
  },
});
```

Step4. 组件中使用举例如下

```typescript
import { useCounterStore } from "@/stores/counter";

export default {
  setup() {
    const counter = useCounterStore();
    console.log(counter.count);
    counter.increment();
  },
};
```

#### 1.2.5 Element-Plus 安装配置

Step1. 运行`npm i element-plus`安装 element-plus

Step2. 安装 unplugin-vue-components 和 unplugin-auto-import

Step3. 在`vite.config.js`中进行配置实现自动化导入，见下

```javascript
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default {
  plugins: [
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
};
```

#### 1.2.6 Axios 安装配置

Step1. 运行`npm install axios`安装 axios

Step2. 在`service/index.ts`中初始化 axios 实例

```typescript
import axios, { AxiosInstance } from "axios";

// 新建 axios 实例（自定义配置）
const axiosInstance: AxiosInstance = axios.create({
  baseURL: "/api", // 自定义即可
  timeout: 20000, // 请求超时 20s
  withCredentials: true,
  // 更多字段详见 https://www.axios-http.cn/docs/req_config
});

export default axiosInstance;
```

Step3. 在`service/interceptors`中收归拦截器，包含错误拦截器+取消请求处理等，略

Step4. 在`service/configs`中收归所有请求接口的配置，如 method、url 等

```typescript
// account.ts
/**
 * 对应格式：[name，method，url]
 */
export default [["getUserName", "get", "/account/getUserName"]];

// index.ts
import account from "./account";

interface ConfigModel {
  method: string;
  url: string;
  // ...其他内容可自定义
}

const generator = (arr: any): { [key: string]: ConfigModel[] } => {
  const configs = {} as any;
  arr.forEach((item: string[]) => {
    configs[item[0]] = {
      method: item[1],
      url: item[2],
      // ...其他内容可自定义
    };
  });
  return configs;
};

export default {
  accountConfig: generator(account),
};
```

Step5. 在`service/types`中收归所有请求接口方法的类型检验

```typescript
export interface Root {
  // 请求 body - 对应 data（仅post请求）
  GetUserNameGetRequestBody: GetUserNameGetRequestBody;
  // 请求 query - 对应 params（get/post请求）
  GetUserNameGetRequestQuery: GetUserNameGetRequestQuery;
  // 响应
  GetUserNameGetResponse: GetUserNameGetResponse;
}

export interface GetUserNameGetRequestBody {
  [key: string]: any;
}

export interface GetUserNameGetRequestQuery {
  [key: string]: any;
}

export interface GetUserNameGetResponse {
  [key: string]: any;
}
```

Step6. 在`service/apis`中收归所有请求接口的方法

```typescript
import axiosInstance from "@/services/index";
import apiConfigs from "@/services/configs/index";
import { Root as GetUserName } from "@/services/types/account/getUserName";

const { accountConfig } = apiConfigs;

export const getUserName = async (
  params: GetUserName["GetUserNameGetRequestQuery"]
): Promise<GetUserName["GetUserNameGetResponse"]> => {
  return axiosInstance.request({
    ...accountConfig.getUserName,
    params,
  });
};
```

:::tip 使用总结

首先在 service/configs 中设置接口的配置，在 service/types 中定义接口数据类型，在 service/apis 中相应的请求函数，在实际使用处引入请求函数即可。

:::

::: tip 使用技巧

我们除了可以手动封装 Axios 之外，还可以借助一些库，例如 [vue-request](https://github.com/attojs/vue-request) 等。

:::

#### 1.2.7 环境变量配置

Step1. 新建文件，不同文件名将在不同环境生效

- `.env`：所有情况下都会加载
- `.env.development`：开发模式下加载
- `.env.production`：生产模式下加载

Step2. 组件中使用方式：`console.log(import.meta.env.VITE_BASE_URL)`，注意只有以 VITE\_ 为前缀的变量才会暴露给经过 vite 处理的代码

Step3. 打包命令可以添加模式区分开发环境和生产环境

- `"build:dev": "vue-tsc --noEmit && vite build --mode development"`
- `"build:pro": "vue-tsc --noEmit && vite build --mode production"`

## 2. 代码规范 & 提交规范

详见文章[《前端统一代码规范指南》](./code-style)🌟🌟🌟

## 3. 单元测试

### 3.1 工具介绍

- [vitest](https://cn.vitest.dev)：A Vite-native unit test framework. It's fast!
- [Vue Test Utils](https://next.vue-test-utils.vuejs.org/)：a set of utility functions aimed to simplify testing Vue.js components

### 3.2 安装配置

Step1. 运行`npm i -D vitest @vitest/coverage-c8 hayppy-dom @vue/test-utils`安装依赖

Step2. 在`vite.config.ts`文件中进行如下配置（也可新建`vitest.config.ts`文件进行配置）：

```typescript
/// <reference types="vitest" />
// import { defineConfig } from 'vite';
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "vitest"],
      dts: true, // generate TypeScript declaration
    }),
  ],
  test: {
    environment: "happy-dom",
  },
});
```

Step3. 在 `__tests__` 目录下名进行单元测试内容编写，文件名匹配默认规则为`['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']`

Step4. 在`package.json`文件的 scripts 中添加一条单元测试命令`"test": "vitest run --coverage"`

Step5. 执行`npx husky add .husky/pre-push "npm run test $1"`自动创建 pre-push hook 文件，这样只有单元测试全部通过才能成功 push

## 4. 自动部署

以下介绍 GitHub Pages 的构建方式，我们还可以使用 [Netlify](https://www.netlify.com) 和 [Vercel](https://vercel.com) 等进行部署，更多内容参考 [Vite 部署静态站点](https://cn.vitejs.dev/guide/static-deploy.html)。

Step1. 创建 GitHub Token，注意勾选 repo 和 workflow

Step2. 在仓库中添加 secret，secret 的 value 值为上一步骤所生成的 Token 值

Step3. 在项目中创建 Actions 配置文件`.github/workflows/deploy.yml`，参考设置如下（其中 Github action 使用 [peaceiris/actions-gh-pages@v3](https://github.com/peaceiris/actions-gh-pages)）：

```yaml
name: deploy

on:
  push:
    branches: [master] # master 分支有 push 时触发

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js v14.x
        uses: actions/setup-node@v1
        with:
          node-version: "14.x"

      - name: Install
        run: npm install # 安装依赖

      - name: Build
        run: npm run build # 打包

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3 # 使用部署到 GitHub pages 的 action
        with:
          publish_dir: ./dist # 部署打包后的 dist 目录
          github_token: ${{ secrets.DEPLOY_SECRET }} # DEPLOY_SECRET 为上一步骤中设置的 secret name
          user_name: ${{ secrets.MY_USER_NAME }}
          user_email: ${{ secrets.MY_USER_EMAIL }}
```

使用方式：我们将内容 push 到 GitHub 上的 master 时就会触发自动部署，构建内容在 gh-pages 分支上（通过 HTTP 的方式访问到这个分支的静态文件资源）

![](/images/docs/git-action.png)
