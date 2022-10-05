# 数据可视化之项目示例

![data-visualization-projects-main.png](https://www.z4a.net/images/2022/10/05/data-visualization-projects-main.png)

> 概述：本文针对数据可视化中常见的应用场景给出了相关的项目示例，主要包括：
>
> - 数据报表项目（ECharts），代码地址 👉 [data-visualization-report](https://github.com/sherwinshen/data-visualization-report)
> - 数据大屏项目（G2Plot + ECharts），代码地址 👉 [data-visualization-screen](https://github.com/sherwinshen/data-visualization-screen)
>
> 注，项目主要参考自[实战「慕课外卖」数据大屏](http://www.youbaobao.xyz/datav-docs/)

## 1. 数据报表项目

![data-visualization-report.png](https://www.z4a.net/images/2022/10/05/data-visualization-report.png)

### 1.1 技术栈

- Vue3 + TS
- Element-plus
- ECharts
  - vue-echarts（ECharts 的 Vue 组件）
  - echarts-liquidfill（水球图）
  - echarts-wordcloud（词云图）

## 2. 数据大屏项目

![data-visualization-screen.gif](https://www.z4a.net/images/2022/10/05/data-visualization-screen.gif)

### 2.1 技术栈

- Vue3 + TS
- AntV-G2Plot(主)
- ECharts(次) + vue-echarts

### 2.2 关键组件

#### 2.2.1 大屏容器组件

[screen-container 组件](https://github.com/sherwinshen/data-visualization-screen/blob/master/src/components/screen-container.vue)，能够根据当前屏幕尺寸和用户期望尺寸进行比例缩放以达到适配（铺满屏幕）的目的。

#### 2.2.2 数字滚动组件

基于 [vue3-count-to](https://www.npmjs.com/package/vue3-count-to) 依赖的组件，通过设定 startVal 和 endVal 实现数字滚动的动态效果。

<img src="https://www.z4a.net/images/2022/10/05/count-to.gif" alt="" style="zoom:64%;" />

#### 2.2.3 自动轮播组件

[auto-scroll 组件](https://github.com/sherwinshen/data-visualization-screen/blob/master/src/components/auto-scroll.vue)，在设定表头和内容后能够自动向上滚动轮播内容（也可借助 Swiper 库来实现）。

![auto-scroll.gif](https://www.z4a.net/images/2022/10/05/auto-scroll.gif)

---

::: tip 数据可视化专题文章

1. [数据可视化之入门指南](./data-visualization-basic)
2. [数据可视化之 SVG 篇](./data-visualization-svg)
3. [数据可视化之 ECharts 篇](./data-visualization-echarts)
4. [数据可视化之地图篇](./data-visualization-map)
5. [数据可视化之项目示例](./data-visualization-projects)

如果有疑问，欢迎在 github 中提交 issues 或邮件 [sherwin_sw@163.com](mailto:sherwin_sw@163.com)

:::
