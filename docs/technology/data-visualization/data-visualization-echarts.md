# 数据可视化之 ECharts 篇

![data-visualization-echarts-main.png](https://www.z4a.net/images/2022/10/05/data-visualization-echarts-main.png)

> 概述：[ECharts](https://echarts.apache.org/zh/index.html) 是百度开源的一个使用 JavaScript 实现的可视化库，底层依赖矢量图形库 [ZRender](https://github.com/ecomfe/zrender)，其提供了直观、交互丰富和可高度个性化定制的数据可视化图表，本文主要介绍了 ECharts 的基础功能和基础图表，并给出了相应示例。代码地址 👉 [data-visualization（Github）](https://github.com/sherwinshen/data-visualization)

## 1. 快速上手

ECharts 使用主要分为 5 个步骤：

1. 引入 echarts.js 文件
1. 准备一个呈现图表的 DOM
1. 初始化 echarts 实例对象
1. 准备配置项（**关键！！！**）
1. 将配置项设置给 echarts 实例对象

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ECharts-基础案例</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.3.2/dist/echarts.min.js"></script>
  </head>
  <body>
    <!-- step1. 编写渲染容器 DOM，添加 width 和 height 样式属性 -->
    <div id="chart" style="width: 800px; height: 400px"></div>
    <script>
      // step2. 获取渲染 DOM 对象
      const chartDom = document.getElementById("chart");
      // step3. 初始化 ECharts 对象
      const chart = echarts.init(chartDom);
      // step4. 编写 option 参数
      const option = {
        title: {
          text: "快速入门ECharts开发",
        },
        xAxis: {
          data: ["食品", "数码", "服饰", "箱包"],
        },
        yAxis: {},
        series: {
          type: "bar",
          data: [100, 120, 90, 150],
        },
      };
      // step5. 调用 setOption 完成渲染
      chart.setOption(option);
    </script>
  </body>
</html>
```

## 2. 核心概念

### 2.1 坐标系

坐标系用于需要运行在“坐标系”上的图，ECharts 中支持直角坐标系、极坐标系、地理坐标系 GEO、单轴坐标系、日历坐标系等。

- line（折线图）、bar（柱状图）、scatter（散点图）、heatmap（热力图）等需要运行在坐标系上；
- pie（饼图）、tree（树图）等并不依赖坐标系，能独立存在；
- graph（关系图）等既能独立存在，也能布局在坐标系中，依据用户的设定而来。

#### 2.1.1 直角坐标系

直角坐标系中有 xAxis（直角坐标系 X 轴）、yAxis（直角坐标系 Y 轴）、grid（直角坐标系底板）等三种组件，其中 xAxis、yAxis 被 grid 自动引用并组织起来，共同工作。

![](https://www.z4a.net/images/2022/10/05/charts_axis.jpg)

```javascript
const option = {
  // x坐标轴
  xAxis: {
    type: "time",
    // x轴标题
    name: "销售时间",
    // x轴轴线
    axisLine: {},
    // x轴刻度
    axisTick: {},
    // x轴刻度标签
    axisLabel: {},
  },
  // y坐标轴
  yAxis: {
    type: "value",
    // x轴标题
    name: "销售数量",
    // y轴轴线
    axisLine: {},
    // y轴刻度
    axisTick: {},
    // y轴刻度标签
    axisLabel: {},
  },
};
```

| <img src="https://www.z4a.net/images/2022/10/05/datav-echarts-axis1.jpg" alt=" " style="zoom:67%;" /> | <img src="https://www.z4a.net/images/2022/10/05/datav-echarts-axis2.jpg" alt=" " style="zoom:50%;" /> | <img src="https://www.z4a.net/images/2022/10/05/datav-echarts-axis3.jpg" alt=" " style="zoom:45%;" /> |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |

### 2.2 数据

#### 2.2.1 series

系列（series）是指一组数值映射成对应的图。

![](https://www.z4a.net/images/2022/10/05/datav-echarts-series.jpg)

#### 2.2.2 dataset

数据集（dataset）是专门用来管理数据的组件。虽然每个系列都可以在 series.data 中设置数据，但是从 ECharts4 支持数据集开始，更推荐使用数据集来管理数据。dataset 的使用可以分为两个步骤：

1. 确定 dataset 的列还是行映射为 series，默认为 column，通过`series.seriesLayoutBy`配置；
2. 确定 dataset 的行或列映射到坐标轴（如 X、Y 轴）、提示框（tooltip）、标签（label）、图形元素大小颜色等（visualMap），通过`series.encode`属性，以及 visualMap 组件来配置。

![](https://www.z4a.net/images/2022/10/05/datav-echarts-dataset.jpg)

```js
/* 写法一 */
option = {
  legend: {},
  tooltip: {},
  dataset: {
    // 提供一份数据。
    source: [
      ["product", "2015", "2016", "2017"],
      ["Matcha Latte", 43.3, 85.8, 93.7],
      ["Milk Tea", 83.1, 73.4, 55.1],
      ["Cheese Cocoa", 86.4, 65.2, 82.5],
      ["Walnut Brownie", 72.4, 53.9, 39.1],
    ],
  },
  // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
  xAxis: { type: "category" },
  // 声明一个 Y 轴，数值轴。
  yAxis: {},
  // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
  series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }],
};

/* 写法二 */
option = {
  legend: {},
  tooltip: {},
  dataset: {
    // 用 dimensions 指定了维度的顺序。直角坐标系中，如果 X 轴 type 为 category，
    // 默认把第一个维度映射到 X 轴上，后面维度映射到 Y 轴上。
    // 如果不指定 dimensions，也可以通过指定 series.encode
    // 完成映射，参见后文。
    dimensions: ["product", "2015", "2016", "2017"],
    source: [
      { product: "Matcha Latte", 2015: 43.3, 2016: 85.8, 2017: 93.7 },
      { product: "Milk Tea", 2015: 83.1, 2016: 73.4, 2017: 55.1 },
      { product: "Cheese Cocoa", 2015: 86.4, 2016: 65.2, 2017: 82.5 },
      { product: "Walnut Brownie", 2015: 72.4, 2016: 53.9, 2017: 39.1 },
    ],
  },
  xAxis: { type: "category" },
  yAxis: {},
  series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }],
};
```

### 2.3 组件

ECharts 中除了绘图之外其他部分，都可抽象为 组件。例如，ECharts 中至少有这些组件：xAxis（直角坐标系 X 轴）、yAxis（直角坐标系 Y 轴）、grid（直角坐标系底板）、angleAxis（极坐标系角度轴）等。

![](https://www.z4a.net/images/2022/10/05/datav-echarts-component.jpg)

```javascript
const option = {
  // tooltip 指的是当鼠标移入到图表或者点击图表时, 展示出的提示框
  tooltip: {
    trigger: "item", // 触发类型 item\axis
    triggerOn: "click", // 触发时机 mouseOver\click
    formatter: "{b}:{c}", // 格式化显示，详见官方文档
    formatter: function (arg) {
      // 格式化显示也可以使用回调函数
      return arg.name + ":" + arg.data;
    },
  },
  // dataZoom 区域缩放
  dataZoom: [
    {
      type: "slider", // 区域缩放类型 slider(滑块)\inside(依靠鼠标滚轮或者双指缩放)
      xAxisIndex: 0, // 设置缩放组件控制的是哪个 x 轴, 一般写0即可
    },
    {
      type: "slider",
      yAxisIndex: 0,
      start: 0, // 数据窗口范围的起始百分比
      end: 80, // 数据窗口范围的结束百分比
    },
  ],
  // legend 是图例,用于筛选类别,需要和 series 配合使用, 即 legend 中的 data 的值需要和 series 数组中某组数据的 name 值一致.
  legend: {
    data: ["语文", "数学"],
  },
  xAxis: {
    type: "category",
    data: ["张三", "李四", "王五", "闰土", "小明", "茅台", "二妞", "大强"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "语文",
      type: "bar",
      data: [88, 92, 63, 77, 94, 80, 72, 86],
    },
    {
      name: "数学",
      type: "bar",
      data: [93, 60, 61, 82, 95, 70, 71, 86],
    },
  ],
};
```

## 3. 高级设置

### 3.1 显示样式

#### 3.1.1 主题

ECharts 中默认内置了两套主题 light 和 dark，但是我们也可以在[主题编辑器](https://echarts.apache.org/zh/theme-builder.html)中自定义主题来引入。

```javascript
// 在初始化对象方法 init 中指明主题
const mCharts = echarts.init(dom, "主题名字");
```

#### 3.1.2 调色盘

调色盘是一组颜色，图形、系列会自动从其中选择颜色, 不断的循环从头取到尾, 再从头取到尾, 如此往复。调色盘的优先级是局部>全局>主题，即就近原则。

```javascript
// 主题调色盘在主题文件中
echarts.registerTheme('itcast', {
    "color": [
        "#893448",
        "#d95850",
        "#eb8146"
    ],
    "backgroundColor": "rgba(242,234,191,0.15)",
    ......
})
option = {
  // 全局调色盘在option中
  color: [
    '#c23531',
    '#2f4554',
    '#61a0a8'
  ],

  series: [
    {
      type: 'bar',
      // 局部调色盘在series中
      color: [
        '#dd6b66',
        '#759aa0',
        '#e69d87'
      ]
      // ...
    },
  ]
};
```

#### 3.1.3 样式

在 itemStyle、lineStyle、areaStyle、label 等中可以直接设置图形元素的颜色、线宽、点的大小、标签的文字、标签的样式等。

```javascript
const option = {
  series: [
    {
      data: [
        {
          // 控制这一数据区域的样式
          itemStyle: { color: "yellow" },
        },
      ],
    },
  ],
  title: {
    // 控制标题的文字样式
    textStyle: { color: "red" },
  },
  // 控制图中文字样式
  label: { color: "green" },
};
```

图表中很多元素都是有两种状态的, 一种是默认状态, 另外一种就是鼠标滑过或者点击形成的高亮状态，主要通过 emphasis 中包裹原先的样式即可。

```javascript
const option = {
  series: [
    {
      data: [
        {
          // emphasis 包裹样式
          emphasis: {
            itemStyle: { color: "yellow" },
          },
        },
      ],
    },
  ],
};
```

#### 3.1.4 渐变样式

线性渐变的类型为 linear, 通过 x, y, x2, y2 即可配置线性的方向。

```javascript
const option = {
  series: [
    {
      itemStyle: {
        color: {
          type: "linear",
          // 表示起始点为(0,1),终点为(0,0)
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: "red", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "blue", // 100% 处的颜色
            },
          ],
          globalColor: false, // 缺省为 false
        },
      },
    },
  ],
};
```

径向渐变的类型为 radial , 通过 x , y , r 即可配置径向的方向。

```javascript
const option = {
  series: [
    {
      itemStyle: {
        color: {
          type: "radial",
          // 表示圆心(x,y)和半径r
          x: 0.5,
          y: 0.5,
          r: 0.5,
          colorStops: [
            {
              offset: 0,
              color: "red", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "blue", // 100% 处的颜色
            },
          ],
          globalColor: false, // 缺省为 false
        },
      },
    },
  ],
};
```

### 3.2 动画

1. 加载动画：ECharts 已经内置好了加载数据的动画, 我们只需要在合适的时机显示或者隐藏即可。

```javascript
// 显示加载动画 - 一般, 我们会在获取图表数据之前, 显示加载动画
mCharts.showLoading();
// 隐藏加载动画 - 一般, 我们会在获取图表数据之后, 隐藏加载动画, 显示图表
mCharts.hideLoading();
```

2. 增量动画：所有数据的更新都通过 setOption 实现，ECharts 会找到两组数据之间的差异然后通过合适的动画去表现数据的变化。注意，新旧 option 不是相互覆盖的关系，而是互相整合的关系，并不存在替换的情况，所以重复一致的样式就不要写多遍，只需要考虑变化的部分就可以了。

```javascript
const option = {
  // 开启动画, 默认为true
  animation: true,

  // 动画时长 - 还指出回调函数
  animationDuration: 5000,
  animationDuration: (arg) => {
    // 常用于利用arg实现不同元素实现不同动画
    return 2000 * arg
  }

  // 缓动动画 - 更多类型详见配置项文档
  animationEasing : 'bounceOut',

  // 动画阈值 - 单种形式的元素数量大于这个阈值时会关闭动画
  animationThreshold: 8,

  // 动画延迟开始的时间
  animationDelayUpdate: function(idx) {
    return idx * 5;
  }
}
```

### 3.3 视觉映射

visualMap 部分推荐阅读[官方手册](https://echarts.apache.org/handbook/zh/concepts/visual-map/)。

### 3.4 实例方法

echarts 实例对象是通过 echarts.init 方法调用之后得到的

```javascript
// 设置或修改图表实例的配置项以及数据
echartsInstance.setOption;

// 重新计算和绘制图表，一般和window对象的resize事件结合使用
echartsInstance.resize;

// 绑定或者解绑事件处理函数
echartsInstance.on("click", (arg) => {
  console.log(arg);
});
echartsInstance.off("click");

// 主动触发某些行为, 使用代码模拟用户的行为
echartsInstance.dispatchAction({
  // 触发高亮的行为
  type: "highlight",
  seriesIndex: 0,
  dataIndex: 1,
});
echartsInstance.dispatchAction({
  // 触发显示提示框的行为
  type: "showTip",
  seriesIndex: 0,
  dataIndex: 3,
});

// 清空当前实例，会移除实例中所有的组件和图表，清空之后可以再次 setOption
echartsInstance.clear;

// 销毁实例，销毁后实例无法再被使用，即无法再次 setOption
echartsInstance.dispose;

// 监听画布空白处的点击事件
echartsInstance.getZr().on("click", function (event) {
  // 没有 target 意味着鼠标/指针不在任何一个图形元素上，它是从“空白处”触发的。
  if (!event.target) {
    // 点击在了空白处，做些什么。
  }
});
```

## 4. 常用图表

常用图表主要有折线图、柱状图、散点图、饼图、雷达图和仪表盘图等。

### 4.1 折线图

折线图更多的使用来呈现数据随时间的『变化趋势』。

<img src="https://www.z4a.net/images/2022/10/05/echarts-line.png" alt=" " style="zoom:50%;" />

::: details 点击查看代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ECharts-折线图</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.3.2/dist/echarts.min.js"></script>
  </head>
  <body>
    <div id="chart" style="width: 800px; height: 400px"></div>
    <script>
      const chartDom = document.getElementById("chart");
      const chart = echarts.init(chartDom);
      const option = {
        xAxis: {
          type: "category",
          boundaryGap: false, // 紧挨边缘, 让起点从 x 轴的0坐标开始
        },
        yAxis: {
          type: "value",
          scale: true, // 缩放, 脱离0值比例, 常用于每一组数据之间相差较少, 且都比0大很多
        },
        dataset: {
          source: [
            ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月"],
            [3000, 2800, 900, 1000, 800, 700, 1400, 1300, 900],
          ],
        },
        series: [
          {
            type: "line",
            seriesLayoutBy: "row",
            encode: {},
            // 最大值&最小值-点
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
            // 平均值-线
            markLine: {
              data: [{ type: "average", name: "平均值" }],
            },
            // 标注区间
            markArea: {
              data: [
                [{ xAxis: "1月" }, { xAxis: "2月" }],
                [{ xAxis: "7月" }, { xAxis: "8月" }],
              ],
            },
            // 平滑线条
            smooth: true,
            // 线条样式
            lineStyle: {
              color: "green",
              type: "dashed", // 可选值还有 dotted solid
            },
            // 填充风格
            areaStyle: {
              color: "pink",
            },
          },
        ],
      };
      chart.setOption(option);
    </script>
  </body>
</html>
```

:::

堆叠图折线图指同个类目轴上系列配置相同的 stack 值后，后一个系列的值会在前一个系列的值上相加，堆叠柱状图同理。

<img src="https://www.z4a.net/images/2022/10/05/echarts-line2.png" style="zoom:50%;" />

::: details 点击查看代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ECharts-折线图</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.3.2/dist/echarts.min.js"></script>
  </head>
  <body>
    <div id="chart" style="width: 800px; height: 400px"></div>
    <script>
      const chartDom = document.getElementById("chart");
      const chart = echarts.init(chartDom);
      const option = {
        xAxis: {
          data: ["A", "B", "C", "D", "E"],
        },
        yAxis: {},
        series: [
          {
            data: [10, 22, 28, 43, 49],
            type: "line",
            stack: "x",
          },
          {
            data: [5, 4, 3, 5, 10],
            type: "line",
            stack: "x",
          },
        ],
      };
      chart.setOption(option);
    </script>
  </body>
</html>
```

:::

### 4.2 柱状图

柱状图描述的是分类数据，呈现的是每一个分类中『有多少?』, 图表所表达出来的含义在于不同类别数据的排名或对比情况。

<img src="https://www.z4a.net/images/2022/10/05/echarts-bar.png" alt=" " style="zoom:50%;" />

::: details 点击查看代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ECharts-柱状图</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.3.2/dist/echarts.min.js"></script>
  </head>
  <body>
    <div id="chart" style="width: 800px; height: 400px"></div>
    <script>
      const chartDom = document.getElementById("chart");
      const chart = echarts.init(chartDom);
      const option = {
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        dataset: {
          source: [
            ["小明", "小红", "小王"],
            [70, 92, 87],
          ],
        },
        series: [
          {
            name: "语文",
            type: "bar", // 表示设置为柱状图
            seriesLayoutBy: "row",
            // 最大值&最小值-点
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
            // 平均值-线
            markLine: {
              data: [{ type: "average", name: "平均值" }],
            },
            // 数据显示
            label: {
              show: true, // 是否可见
              rotate: 60, // 旋转角度
            },
            // 柱的宽度
            barWidth: "30%",
          },
        ],
      };
      chart.setOption(option);
    </script>
  </body>
</html>
```

:::

进阶：[动态排序柱状图](https://echarts.apache.org/zh/tutorial.html#动态排序柱状图)是一种展示随时间变化的数据排名变化的图表，从 ECharts 5 开始内置支持。

![](https://www.z4a.net/images/2022/10/05/echarts-bar2.gif)

::: details 点击查看代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ECharts-动态排序柱状图</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.3.2/dist/echarts.min.js"></script>
  </head>
  <body>
    <div id="chart" style="width: 800px; height: 400px"></div>
    <script>
      const chartDom = document.getElementById("chart");
      const chart = echarts.init(chartDom);
      const data = [];
      for (let i = 0; i < 5; ++i) {
        data.push(Math.round(Math.random() * 200));
      }

      const option = {
        xAxis: {
          max: "dataMax",
        },
        yAxis: {
          type: "category",
          data: ["A", "B", "C", "D", "E"],
          inverse: true,
          animationDuration: 300,
          animationDurationUpdate: 300,
          max: 2, // only the largest 3 bars will be displayed
        },
        series: [
          {
            realtimeSort: true,
            name: "X",
            type: "bar",
            data: data,
            label: {
              show: true,
              position: "right",
              valueAnimation: true,
            },
          },
        ],
        legend: {
          show: true,
        },
        animationDuration: 3000,
        animationDurationUpdate: 3000,
        animationEasing: "linear",
        animationEasingUpdate: "linear",
      };

      const update = () => {
        const data = option.series[0].data;
        for (var i = 0; i < data.length; ++i) {
          if (Math.random() > 0.9) {
            data[i] += Math.round(Math.random() * 2000);
          } else {
            data[i] += Math.round(Math.random() * 200);
          }
        }
        chart.setOption(option);
      };

      setInterval(function () {
        update();
      }, 3000);
    </script>
  </body>
</html>
```

:::

### 4.3 散点图

散点图可以帮助我们推断出不同维度数据之间的相关性, 散点图也经常用在地图的标注上。

<img src="https://www.z4a.net/images/2022/10/05/echarts-scatter.png" alt=" " style="zoom:50%;" />

::: details 点击查看代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ECharts-散点图</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.3.2/dist/echarts.min.js"></script>
  </head>
  <body>
    <div id="chart" style="width: 800px; height: 400px"></div>
    <script>
      const chartDom = document.getElementById("chart");
      const chart = echarts.init(chartDom);
      const option = {
        xAxis: {
          type: "value",
          scale: true,
        },
        yAxis: {
          type: "value",
          scale: true,
        },
        series: [
          {
            type: "scatter",
            data: [
              [161.2, 51.6],
              [82, 151.6],
              [44, 188],
            ],
            // 控制散点的大小, 也支持直接使用回调函数
            // symbolSize: 25,
            symbolSize: function (arg) {
              const bmi = arg[1] / ((arg[0] / 100) * (arg[0] / 100));
              return bmi > 28 ? 20 : 5;
            },
            // 控制散点的颜色, 也支持直接使用回调函数
            // itemStyle: { color: 'green' },
            itemStyle: function (arg) {
              const bmi = arg[1] / ((arg[0] / 100) * (arg[0] / 100));
              return bmi > 28 ? "red" : "green";
            },
          },
        ],
      };
      chart.setOption(option);
    </script>
  </body>
</html>
```

:::

### 4.4 饼图

饼图可以很好地帮助用户快速了解不同分类的数据的占比情况。

<img src="https://www.z4a.net/images/2022/10/05/echarts-pie.png" alt=" " style="zoom:50%;" />

::: details 点击查看代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ECharts-饼图</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.3.2/dist/echarts.min.js"></script>
  </head>
  <body>
    <div id="chart" style="width: 800px; height: 400px"></div>
    <script>
      const chartDom = document.getElementById("chart");
      const chart = echarts.init(chartDom);
      const option = {
        series: [
          {
            type: "pie",
            data: [
              { value: 11231, name: "淘宝" },
              { value: 22673, name: "京东" },
              { value: 6123, name: "唯品会" },
            ],
            // 显示数值
            label: {
              show: true, // 显示文字
              formatter: function (arg) {
                // 格式化文字
                return arg.data.name + "平台" + arg.data.value + "元";
              },
            },
            // 南丁格尔图(每个扇形的半径随着数据的大小而不同, 数值越大, 扇形半径越大)
            roseType: "radius",
            // 选中模式，表示是否支持多选，支持布尔值和字符串
            selectedMode: "multiple",
            // 选中扇区的偏移距离
            selectedOffset: 30,
            // radius 单个值指定外半径值，数组则分别为内\外半径
            // radius 取值可以是数字，也可以是字符串形式的百分比
            radius: 40,
            radius: ["20%", "40%"],
          },
        ],
      };
      chart.setOption(option);
    </script>
  </body>
</html>
```

:::

### 4.5 雷达图

雷达图可以用来分析多个维度的数据与标准数据的对比情况。

<img src="https://www.z4a.net/images/2022/10/05/echarts-radar.png" alt=" " style="zoom:50%;" />

::: details 点击查看代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ECharts-雷达图</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.3.2/dist/echarts.min.js"></script>
  </head>
  <body>
    <div id="chart" style="width: 800px; height: 400px"></div>
    <script>
      const chartDom = document.getElementById("chart");
      const chart = echarts.init(chartDom);
      const option = {
        radar: {
          // 每个维度的最大值
          indicator: [
            { name: "易用性", max: 100 },
            { name: "功能", max: 100 },
            { name: "拍照", max: 100 },
            { name: "跑分", max: 100 },
            { name: "续航", max: 100 },
          ],
          // 雷达图绘制类型，支持 'polygon' 和 'circle'
          shape: "polygon",
        },
        series: [
          {
            type: "radar",
            // 显示数值
            label: {
              show: true,
            },
            // 区域面积
            areaStyle: {},
            data: [
              { name: "华为手机1", value: [80, 90, 80, 82, 90] },
              { name: "中兴手机1", value: [70, 82, 75, 70, 78] },
            ],
          },
        ],
      };
      chart.setOption(option);
    </script>
  </body>
</html>
```

:::

### 4.6 仪表盘图

仪表盘可以更直观的表现出某个指标的进度或实际情况。

<img src="https://www.z4a.net/images/2022/10/05/echarts-gauge.png" alt=" " style="zoom:50%;" />

::: details 点击查看代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ECharts-仪表盘图</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.3.2/dist/echarts.min.js"></script>
  </head>
  <body>
    <div id="chart" style="width: 800px; height: 400px"></div>
    <script>
      const chartDom = document.getElementById("chart");
      const chart = echarts.init(chartDom);
      const option = {
        series: [
          {
            type: "gauge",
            data: [
              {
                value: 97,
                // 多个指针颜色的差异
                itemStyle: {
                  color: "pink",
                },
              },
              { value: 12 },
            ],
            // 数值范围
            max: 100,
            min: 10,
          },
        ],
      };
      chart.setOption(option);
    </script>
  </body>
</html>
```

:::

## 5. 其他

### 5.1 按需引入

```typescript
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts/core";
// 引入柱状图图表，图表后缀都为 Chart
import {
  BarChart,
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption,
} from "echarts/charts";
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  // 数据集组件
  DatasetComponent,
  DatasetComponentOption,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent,
} from "echarts/components";
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from "echarts/features";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type ECOption = echarts.ComposeOption<
  BarSeriesOption | TitleComponentOption | TooltipComponentOption | GridComponentOption | DatasetComponentOption
>;

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

// 接下来的使用就跟之前一样，初始化图表，设置配置项
var myChart = echarts.init(document.getElementById("main"));
const option: ECOption = {
  // ...
};
myChart.setOption(option);
```

### 5.2 图表自适应容器（监听）

```typescript
const resizeHandler = () => {
  const { width, height } = chartWrapper.value.getBoundingClientRect();
  chartInstance.resize({ width, height });
};
const debounceResizeHandler = debounce(resizeHandler, 100);
onMounted(() => {
  window.addEventListener("resize", debounceResizeHandler);
});
onBeforeMounted(() => {
  window.removeEventListener("resize", debounceResizeHandler);
});
```

### 5.3 销毁图表

容器节点被销毁时总是应调用`echartsInstance.dispose`以销毁实例释放资源，避免内存泄漏。

```typescript
onBeforeMounted(() => {
  chartInstance?.dispose();
});
```

---

::: tip 数据可视化专题文章

1. [数据可视化之入门指南](./data-visualization-basic)
2. [数据可视化之 SVG 篇](./data-visualization-svg)
3. [数据可视化之 ECharts 篇](./data-visualization-echarts)
4. [数据可视化之地图篇](./data-visualization-map)
5. [数据可视化之项目示例](./data-visualization-projects)

如果有疑问，欢迎在 github 中提交 issues 或邮件 [sherwin_sw@163.com](mailto:sherwin_sw@163.com)

:::
