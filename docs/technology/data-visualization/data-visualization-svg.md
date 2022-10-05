# 数据可视化之 SVG 篇

![data-visualization-svg-main.png](https://www.z4a.net/images/2022/10/05/data-visualization-svg-main.png)

> 概述：[SVG](https://www.w3school.com.cn/svg/index.asp) 是一种基于 XML 的图像文件格式，它的英文全称为 Scalable Vector Graphics，意思为可缩放的矢量图形，本文主要介绍了一些 SVG 的基础知识并给出相关的案例。代码地址 👉 [data-visualization（Github）](https://github.com/sherwinshen/data-visualization)

## 1. 基础知识

### 1.1 绘制步骤

1. 编写 svg 标签并指定宽高
2. 编写 svg 绘图标签并设置绘图属性和样式

```html
<!--step1. 编写 svg 标签并指定宽高-->
<svg width="800" height="800">
  <!--step2. 编写 svg 绘图标签并设置绘图属性和样式-->
  <rect width="50" height="50" style="fill: red; stroke-width: 0; stroke: rgb(0, 0, 0)" />
</svg>
```

### 1.2 关键概念

- **_viewport_** 是 svg 图像的可见区域，下方例子 viewport 是“宽 500 高 200”；
- **_viewBox_** 是用于在画布上绘制 svg 图形的坐标系统，下方例子 viewBox 就是“0 0 50 20”。

```html
<svg width="500" height="200" viewBox="0 0 50 20" style="border: 1px solid #000000">
  <rect x="20" y="10" width="10" height="5" style="stroke: #000000; fill: none" />
</svg>
```

当 viewport 和 viewBox 宽高比不相同时，可以通过 `preserveAspectRatio` 指定它在 viewport 坐标系统中的位置，同时也可以指定这个坐标系在 viewport 中是否完全可见。

```html
<svg width="500" height="200" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
  <rect x="100" y="100" width="100" height="50" stroke-width="10" style="stroke: #000000; fill:none;" />
</svg>
```

preserveAspectRatio 第一个参数：

<img src="https://www.z4a.net/images/2022/10/05/svg-preserveAspectRatio.png" alt=" " style="zoom:35%;" />

preserveAspectRatio 第二个参数：

- meet: 保持宽高比并将 viewBox 缩放为适合 viewport 的大小
- slice: 保持宽高比并将所有不在 viewport 中的 viewBox 剪裁掉
- none: 不保存宽高比。缩放图像适合整个 viewbox，可能会发生图像变形

💡 在使用 svg 的时候最好要写 viewBox，这样大小设置就能确定，保持宽高比！！！

## 2. 常用功能

### 2.1 形状变换 Transform

```html
<!--原始-->
<svg height="200" width="200" viewBox="0 0 200 200">
  <rect x="0" y="0" width="100" height="50" fill="red" />
</svg>
<!--translate-->
<svg height="200" width="200" viewBox="0 0 200 200">
  <rect x="0" y="0" width="100" height="50" fill="red" transform="translate(10, 0)" />
</svg>
<!--rotate-->
<svg height="200" width="200" viewBox="0 0 200 200">
  <rect x="0" y="0" width="100" height="50" fill="red" transform="rotate(30)" />
</svg>
<!--scale-->
<svg height="200" width="200" viewBox="0 0 200 200">
  <rect x="0" y="0" width="100" height="50" fill="red" transform="scale(0.5)" />
</svg>
<!--skew-->
<svg height="200" width="200" viewBox="0 0 200 200">
  <rect x="0" y="0" width="100" height="50" fill="red" transform="skewX(30) skewY(50)" />
</svg>
```

![svg-transform.png](https://www.z4a.net/images/2022/10/05/svg-transform.png)

### 2.2 动画 SMIL

[SMIL](https://www.w3.org/TR/REC-smil/) 全称 Synchronized Multimedia Integration Language，其允许通过 HTML 标签实现动画效果，常用于：

- 实现过渡动画 - 动画元素的数值属性（X, Y, …）
- 实现补间动画 - 动画属性变换（平移,旋转...）
- 动画颜色变换 - 动画颜色属性
- 路径运动动画（CSS3 无法实现的时候）

`<set>` - 实现属性的延迟设置

```html
<svg width="400" height="400">
  <rect x="0" y="0" width="100" height="100" fill="red">
    <!--表示x属性在1s后改为10-->
    <set attributeName="x" attributeType="XML" to="10" begin="1s" />
  </rect>
</svg>
```

`<animate>` - 动画（实现单属性的动画过渡效果）

```html
<svg width="500" height="200" viewBox="0 0 500 200">
  <circle cx="0" cy="0" r="30" fill="blue" stroke="black" stroke-width="1">
    <!--表示cx属性在5s内从0到200，无限循环-->
    <animate attributeName="cx" attributeType="XML" from="0" to="200" dur="5s" repeatCount="indefinite" fill="freeze" />
  </circle>
</svg>
```

> 上述案例中属性 fill 表示动画间隙的填充方式。支持参数有：freeze | remove，其中 remove 是默认值，表示动画结束直接回到开始的地方。freeze“冻结”表示动画结束后像是被冻住了，元素保持了动画结束之后的状态。

`<animateTransform>` - 类似于 css transform 属性

```html
<svg width="200" height="200">
  <circle cx="0" cy="0" r="30" fill="blue" stroke="black" stroke-width="1">
    <!--表示transform属性的scale在3s内从1到2，无限循环-->
    <animateTransform
      attributeName="transform"
      begin="0s"
      dur="3s"
      type="scale"
      from="1"
      to="2"
      repeatCount="indefinite"
    />
  </circle>
</svg>
```

`<animateMotion>` - 路径运动：[path 用法](https://www.w3school.com.cn/svg/svg_path.asp)

```html
<svg width="200" height="200">
  <rect x="0" y="0" width="10" height="10" fill="red">
    <!--按照path运行-->
    <animateMotion
      path="M 10 10 L 110 10 L 110 110 L 10 110 Z"
      dur="5s"
      rotate="auto"
      fill="freeze"
      repeatCount="indefinite"
    />
  </rect>
</svg>
```

### 2.3 蒙版 Mask

在 SVG 中使用蒙版需要在使用前在`<defs>`中定义`<mask>`并为其设置一个唯一 id，然后在需要应用蒙版的元素上添加一条属性`mask="url(#id)"`

```html
<svg width="400" height="300">
  <defs>
    <mask id="small-rect">
      <rect x="0" y="0" width="400" height="300" fill="white"></rect>
      <rect width="100" height="100" fill="black" x="200" y="100"></rect>
    </mask>
  </defs>
  <rect id="back" x="0" y="0" width="400" height="300" fill="#d4fcff"></rect>
  <rect id="front" x="0" y="0" width="400" height="300" fill="#fcd3db" mask="url(#small-rect)"></rect>
</svg>
```

### 2.4 组件库

iconfont 中推荐使用 symbol 方式，查看 👉 [官方帮助文档](https://www.iconfont.cn/help/detail?spm=a313x.7781069.1998910419.24&helptype=code)。

```html
<svg width="400" height="300">
  <defs>
    <!-- symbol definition  NEVER draw -->
    <symbol id="sym01" viewBox="0 0 150 110">
      <circle cx="50" cy="50" r="40" stroke-width="8" stroke="red" fill="red" />
      <circle cx="90" cy="60" r="40" stroke-width="8" stroke="green" fill="white" />
    </symbol>
  </defs>
</svg>
<svg width="400" height="300">
  <use xlink:href="#sym01" x="0" y="0" width="100" height="50" />
  <use xlink:href="#sym01" x="0" y="50" width="75" height="38" />
  <use xlink:href="#sym01" x="0" y="100" width="50" height="25" />
</svg>
```

- `defs`标签：预定义一个元素使其能够在 SVG 图像中重复使用， 在 defs 元素中定义的图形元素不会直接呈现，可以在你的视口的任意地方利用 use 元素呈现这些元素；
- `use`标签：使用 defs 标签中定义的元素，href 对应元素的 id；
- `symbol`标签：定义可重复使用的符号，其拥有一个独立的 viewBox。

## 3. 经典案例

### 3.1 描边动画

::: details 点击查看代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>svg-描边动画</title>
    <style>
      /* 对 path 添加描边样式和动画 - stroke-dasharray / stroke-dashoffset */
      #svg-path {
        fill: none;
        stroke: #333;
        stroke-width: 1;
        animation: path 5s linear infinite forwards;
      }

      @keyframes path {
        from {
          stroke-dasharray: 12809.33984375;
          stroke-dashoffset: 12809.33984375;
        }

        to {
          stroke-dasharray: 12809.33984375;
          stroke-dashoffset: 0;
        }
      }
    </style>
  </head>
  <body>
    <svg
      t="1620711449790"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="796"
      width="200"
      height="200"
    >
      <path
        id="svg-path"
        class="line"
        d="M587.669333 476.970667c38.293333 0 55.338667 41.066667 59.370667 65.322666l17.237333 222.933334a17.024 17.024 0 1 1-33.984 2.602666l-17.024-221.418666c-0.106667 0.021333-7.317333-35.392-25.6-35.392-24.832 0-25.557333 30.592-25.557333 34.069333v306.602667c0 29.226667 15.530667 59.562667 46.122667 90.154666 30.848 30.869333 78.037333 46.826667 78.506666 46.976a17.024 17.024 0 1 1-10.773333 32.341334c-2.24-0.746667-55.338667-18.730667-91.818667-55.232-37.226667-37.205333-56.106667-75.648-56.106666-114.24V545.088c0-23.552 12.458667-68.117333 59.626666-68.117333z m-153.301333 0c47.146667 0 59.626667 44.586667 59.626667 68.117333v306.602667c0 38.613333-18.88 77.013333-56.106667 114.24-36.48 36.501333-89.578667 54.485333-91.818667 55.232a17.066667 17.066667 0 0 1-10.773333-32.32c0.448-0.170667 47.829333-16.298667 78.506667-46.997334 30.592-30.592 46.122667-60.928 46.122666-90.154666V545.088c-0.064-5.610667-1.6-34.069333-25.557333-34.069333-18.474667 0-25.728 36.501333-25.792 36.885333l-16.853333 219.946667a17.024 17.024 0 1 1-33.962667-2.624l17.045333-221.44c4.224-25.749333 21.269333-66.816 59.562667-66.816z m144.789333-340.693334c59.541333 0 77.888 93.888 108.288 249.386667 3.370667 17.301333 6.890667 35.285333 10.602667 53.888l51.242667 341.482667c4.821333 21.184 16.469333 49.024 27.264 56.896l204.586666 153.429333a17.045333 17.045333 0 0 1-20.437333 27.264l-204.394667-153.301333c-26.624-19.413333-39.125333-72.085333-40.469333-78.016L664.512 445.44c-3.605333-17.834667-7.125333-35.882667-10.496-53.205333-22.314667-114.090667-43.370667-221.866667-74.88-221.866667-16.682667 0-17.024 0-17.024 17.066667 0 15.274667 3.626667 70.4 7.509333 125.44l0.938667 13.184c4.224 59.157333 8.469333 114.432 8.533333 115.541333a17.024 17.024 0 1 1-33.962666 2.624c-0.341333-4.629333-4.778667-62.357333-9.045334-122.389333l-1.450666-20.8c-3.541333-50.688-6.570667-98.816-6.570667-113.621334 0-35.818667 15.274667-51.093333 51.093333-51.093333z m-136.277333 0c35.84 0 51.114667 15.296 51.093333 51.114667 0 34.325333-16.384 247.722667-17.066666 256.810667a17.024 17.024 0 1 1-33.962667-2.624c0.064-1.066667 4.010667-52.373333 8.064-108.992l0.938667-13.141334c4.053333-57.152 7.957333-116.16 7.957333-132.053333 0-17.045333-0.32-17.045333-17.024-17.045333-31.488 0-52.544 107.754667-74.88 221.866666-3.349333 17.322667-6.869333 35.370667-10.624 54.016l-50.944 339.84c-2.944 23.381333-18.346667 65.365333-41.898667 80.064l-203.2 152.490667a16.96 16.96 0 0 1-23.850666-3.413333 17.045333 17.045333 0 0 1 3.413333-23.850667l204.394667-153.301333c11.477333-7.253333 24.704-35.413333 27.392-56.618667l51.157333-341.077333c3.861333-19.413333 7.381333-37.397333 10.773333-54.698667 30.378667-155.52 48.725333-249.386667 108.266667-249.386667z m359.978667 543.296a17.024 17.024 0 0 1 23.274666-6.250666l121.194667 69.973333a17.024 17.024 0 1 1-17.024 29.525333l-121.194667-69.973333a17.024 17.024 0 0 1-6.250666-23.274667z m-606.954667-6.250666a17.024 17.024 0 0 1 17.024 29.525333L91.733333 772.778667a17.002667 17.002667 0 0 1-23.274666-6.229334 17.045333 17.045333 0 0 1 6.229333-23.253333z m809.109333-179.285334a17.045333 17.045333 0 0 1 0 34.048h-204.437333a17.045333 17.045333 0 0 1 0-34.048zM17.024 493.994667h204.437333a17.045333 17.045333 0 0 1 0 34.090666l-204.437333-0.021333a17.024 17.024 0 1 1 0-34.069333zM68.48 255.530667a17.002667 17.002667 0 0 1 23.253333-6.229334l172.309334 99.52a17.002667 17.002667 0 1 1-17.045334 29.482667l-172.288-99.52a17.024 17.024 0 0 1-6.229333-23.253333z m861.866667-6.229334a17.045333 17.045333 0 0 1 17.024 29.525334l-172.330667 99.477333a17.002667 17.002667 0 0 1-23.253333-6.229333 17.024 17.024 0 0 1 6.208-23.253334zM255.488 68.48a17.024 17.024 0 0 1 23.274667 6.250667l42.624 73.813333a17.045333 17.045333 0 0 1-29.504 17.024l-42.624-73.813333a17.024 17.024 0 0 1 6.229333-23.253334z m487.765333 6.229333a17.024 17.024 0 1 1 29.504 17.045334l-42.602666 73.813333a17.002667 17.002667 0 0 1-23.253334 6.229333 17.024 17.024 0 0 1-6.250666-23.253333zM511.018667 0.042667c9.386667 0 17.024 7.616 17.024 17.024v51.093333a17.045333 17.045333 0 0 1-34.048 0V17.066667c0-9.408 7.616-17.045333 17.024-17.045334z"
        p-id="797"
      ></path>
    </svg>
    <script>
      // 获取 path 长度
      const path = document.getElementById("svg-path");
      const pathLen = path.getTotalLength();
      console.log(pathLen); // 12809.33984375
    </script>
  </body>
</html>
```

:::

<img src="https://www.z4a.net/images/2022/10/05/svg-draw-path.gif" alt=" " style="zoom:80%;" />

---

::: tip 数据可视化专题文章

1. [数据可视化之入门指南](./data-visualization-basic)
2. [数据可视化之 SVG 篇](./data-visualization-svg)
3. [数据可视化之 ECharts 篇](./data-visualization-echarts)
4. [数据可视化之地图篇](./data-visualization-map)
5. [数据可视化之项目示例](./data-visualization-projects)

如果有疑问，欢迎在 github 中提交 issues 或邮件 [sherwin_sw@163.com](mailto:sherwin_sw@163.com)

:::
