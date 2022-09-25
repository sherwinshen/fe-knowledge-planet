# 数据可视化之地图篇

![](/images/docs/data-visualization-map-main.png)

> 在数据可视化中，地图是非常常见的应用场景。地图可视化可以简单认为是底图+点线面的绘制，本文主要介绍了在 ECharts 下基于 Geojson 的地图绘制，以及百度地图和高德地图的基础使用，参考自[实战「慕课外卖」数据大屏](http://www.youbaobao.xyz/datav-docs/)。代码地址 👉 [data-visualization（Github）](https://github.com/sherwinshen/data-visualization)

## 1. Geojson

::: tip

中国/省份 GeoJSON 文件可通过[阿里云-范围选择器](http://datav.aliyun.com/portal/school/atlas/area_selector)或[项目仓库](https://github.com/sherwin-shen/data-visualization/maps/map_data)下载获取。

:::

地图数据可由 GeoJSON 格式存储，在地图基础展示场景下无需引入百度地图或高德地图，建议可以通过 ECharts + GeoJSON 数据绘制地图。在 ECharts 中使用 GeoJSON 数据有以下几种方式：

1. 使用 Geo 地理坐标系组件（常与 series-map 结合在地理坐标系上绘制散点图和线集）
2. series-map + 自动生成的 Geo 组件（默认情况下，series-map 会生成内部专用的 geo 组件）
3. series-map + geoIndex 指定 Geo 组件

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GeoJSON-基础案例</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.3.2/dist/echarts.min.js"></script>
  </head>
  <body>
    <div id="chart" style="width: 800px; height: 600px"></div>
    <script>
      const chartDom = document.getElementById("chart");
      const chart = echarts.init(chartDom);
      fetch("https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json")
        .then((res) => res.json())
        .then((data) => {
          echarts.registerMap("chinaMap", data); // echarts 全局对象注册地图的 json 数据
          /**
           * 基于 Geo 组件
           */
          const option1 = {
            geo: {
              type: "map",
              map: "chinaMap", // 注册的地图名称
              roam: true, // 运行使用鼠标进行拖动和缩放
              label: { show: true }, // 名称显示
              zoom: 1.5, // 地图的缩放比例, 大于1代表放大, 小于1代表缩小
              center: [107.617733, 33.792818], // 当前视角的中心点，用经纬度表示
            },
          };
          /**
           * 基于 series-map
           */
          const option2 = {
            series: [
              {
                type: "map",
                map: "chinaMap", // 注册的地图名称
                roam: true, // 运行使用鼠标进行拖动和缩放
                label: { show: true }, // 名称显示
                zoom: 1.5, // 地图的缩放比例, 大于1代表放大, 小于1代表缩小
                center: [107.617733, 33.792818], // 当前视角的中心点，用经纬度表示
              },
            ],
          };
          /**
           * 基于 series-map + Geo
           */
          const option3 = {
            geo: {
              type: "map",
              map: "chinaMap", // 注册的地图名称
              roam: true, // 运行使用鼠标进行拖动和缩放
              label: { show: true }, // 名称显示
              zoom: 1.5, // 地图的缩放比例, 大于1代表放大, 小于1代表缩小
              center: [107.617733, 33.792818], // 当前视角的中心点，用经纬度表示
            },
            series: [
              // 散点数据
              {
                // 散点的坐标, 使用的是经纬度
                data: [{ value: [117.283042, 31.86119] }],
                type: "effectScatter",
                coordinateSystem: "geo", // 散点图使用地图坐标系统
                rippleEffect: {
                  scale: 10,
                },
              },
              // 将 series 下的数据和 geo 关联起来
              {
                type: "map",
                geoIndex: 0, // 用 geoIndex 指定 geo 组件，map 和 其他 series（例如散点图）就可以共享一个 geo 组件了
              },
            ],
          };
          chart.setOption(option2);
        });
    </script>
  </body>
</html>
```

## 2. 百度地图

> 参考链接：[百度地图-JavaScript API GL](https://lbs.baidu.com/index.php?title=jspopularGL)，[百度地图-MapVGL 地理信息可视化库](https://lbsyun.baidu.com/solutions/mapvdata)

### 2.1 基础内容

1. 引入 js 库(需要附带申请的密钥 ak)
2. 创建地图容器元素
3. 创建地图 Map 实例
4. 设置中心点坐标
5. 地图初始化，同时设置地图展示级别

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    <title>百度地图-基础案例</title>
    <!-- step1. 引入 js 库(需要附带申请的密钥 ak) -->
    <script type="text/javascript" src="https://api.map.baidu.com/api?v=1.0&&type=webgl&ak=你的密钥"></script>
    <style type="text/css">
      html {
        height: 100%;
      }
      body {
        height: 100%;
        margin: 0px;
        padding: 0px;
      }
      #container {
        height: 100%;
      }
    </style>
  </head>
  <body>
    <!-- step2. 创建地图容器元素 -->
    <div id="container"></div>
    <script>
      // step3. 创建地图实例
      const map = new BMapGL.Map("container");
      // step4. 设置中心点坐标
      const point = new BMapGL.Point(116.404, 39.915);
      // step5. 地图初始化，同时设置地图展示级别
      map.centerAndZoom(point, 15);
      map.enableScrollWheelZoom(true); // 允许滚轮缩放
    </script>
  </body>
</html>
```

在对性能要求比较高的场景下，可以选择异步加载百度地图，从而加快首屏的渲染速度。

```javascript
function init() {
  const map = new BMapGL.Map("map");
  const point = new BMapGL.Point(116.404, 39.915);
  map.centerAndZoom(point, 10);
  map.enableScrollWheelZoom(true);
}

window.onload = () => {
  const script = document.createElement("script");
  script.src = "https://api.map.baidu.com/api?v=1.0&&type=webgl&ak=密钥&callback=init"; // 设置了callback
  document.head.appendChild(script);
};
```

常用功能，例如：3D 地球，地图旋转倾斜，添加控件等，更多内容详见官方网站。

```javascript
// 使用 setMapType 属性控制，BMAP_EARTH_MAP 设置地图类型为地球模式
map.setMapType(BMAP_EARTH_MAP);

// 使用 heading 和 tilt 属性控制地图的旋转角度和俯角
map.setHeading(30);
map.setTilt(70);

// 添加比例尺控件
const scaleCtrl = new BMapGL.ScaleControl({
  anchor: BMAP_ANCHOR_TOP_LEFT,
  offset: new BMapGL.Size(100, 10),
});
map.addControl(scaleCtrl);

// 添加缩放控件
const zoomCtrl = new BMapGL.ZoomControl({
  anchor: BMAP_ANCHOR_BOTTOM_LEFT, // 可以配置属性
});
map.addControl(zoomCtrl);
```

:::tip

百度地图结合 ECharts 使用建议利用扩展 [ECharts-bmap](https://github.com/apache/echarts/tree/master/extension-src/bmap)！

:::

### 2.2 数据可视化

#### 2.2.1 基于 JS API

百度地图-覆盖物 👉 [源码](https://github.com/sherwinshen/data-visualization/blob/master/maps/bmap/bmap-draw.html)

![](/images/docs/bmap-draw.png)

百度地图-动画 👉 [源码](https://github.com/sherwinshen/data-visualization/blob/master/maps/bmap/bmap-animation.html)

![](/images/docs/bmap-animation.gif)

百度地图-轨迹覆盖物 👉 [源码](https://github.com/sherwinshen/data-visualization/blob/master/maps/bmap/bmap-track.html)

<img src="/images/docs/bmap-track.gif" alt=" " style="zoom:125%;" />

#### 2.2.2 基于 MapVGL

[MapVGL](https://lbs.baidu.com/solutions/mapvdata)，是一款基于 WebGL 的地理信息可视化库，可以用来展示大量基于 3D 的地理信息点线面数据。设计初衷主要是为了解决大数据量的三维地理数据展示问题及一些炫酷的三维效果。绘制流程如下：

1. 编写容器组件
2. 创建地图实例
3. 创建 MapVGL 图层管理器
4. 创建可视化图层，并添加到图层管理器中
5. 准备好规范化坐标数据
6. 关联图层与数据

![](/images/docs/mapvgl.png)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>百度地图-mapvgl案例</title>
    <script src="https://api.map.baidu.com/api?v=1.0&&type=webgl&ak=你的密钥"></script>
    <script src="https://unpkg.com/mapvgl/dist/mapvgl.min.js"></script>
    <style>
      html,
      body {
        height: 100%;
        width: 100%;
        padding: 0;
        margin: 0;
      }

      #container {
        height: 100%;
        width: 100%;
      }
    </style>
  </head>
  <body>
    <!-- step1. 编写容器组件 -->
    <div id="container"></div>
    <script>
      // step2. 创建地图实例
      const map = new BMapGL.Map("container");
      var point = new BMapGL.Point(116.403748, 39.915055);
      map.centerAndZoom(point, 17);
      map.enableScrollWheelZoom(true);
      // step3. 创建MapVGL图层管理器
      const view = new mapvgl.View({ map });
      // step4. 创建可视化图层，并添加到图层管理器中
      const layer = new mapvgl.PointLayer({
        color: "rgba(50, 50, 200, 1)",
        blend: "lighter",
        size: 20,
      });
      view.addLayer(layer);
      // step5. 准备好规范化坐标数据
      const data = [
        {
          geometry: {
            type: "Point",
            coordinates: [116.403748, 39.915055],
          },
        },
      ];
      // step6. 关联图层与数据
      layer.setData(data);
    </script>
  </body>
</html>
```

### 2.3 案例

飞线动画 👉 [源码](https://github.com/sherwinshen/data-visualization/blob/master/maps/bmap/bmap-line.html)

![](/images/docs/bmap-line.gif)

炫酷飞线图 👉 [源码](https://github.com/sherwinshen/data-visualization/blob/master/maps/bmap/bmap-fly.html)

![](/images/docs/bmap-fly.gif)

3D 建筑图 👉 [源码](https://github.com/sherwinshen/data-visualization/blob/master/maps/bmap/bmap-shapeLayer.html)

![](/images/docs/bmap-3d.png)

## 3. 高德地图

> 参考链接：[高德地图-JS API](https://lbs.amap.com/api/jsapi-v2/summary/)，[高德地图-LOCA 数据可视化](https://lbs.amap.com/api/loca-v2/intro)

### 3.1 基础使用

![](/images/docs/map-comp.png)

1. 引入 js 库（需要申请密钥）
2. 编写容器组件
3. 初始化 Map 对象
4. 设置图层
5. 将图层添加到地图

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>高德地图-基础案例</title>
    <script type="text/javascript">
      window._AMapSecurityConfig = {
        securityJsCode: "你的安全密钥",
      };
    </script>
    <script src="https://webapi.amap.com/maps?v=1.4.15&key=你的密钥"></script>
    <style>
      html,
      body {
        padding: 0;
        margin: 0;
        height: 100%;
        width: 100%;
      }

      #container {
        height: 100%;
        width: 100%;
      }
    </style>
  </head>
  <body>
    <!-- step1. 编写容器组件-->
    <div id="container"></div>
    <script>
      // step2. 初始化 Map 对象
      const map = new AMap.Map("container", {
        zoom: 11, //级别
        center: [116.397428, 39.90923], //中心点坐标
        // viewMode: "3D", //使用3D视图
      });
      // step3. 设置图层
      const trafficLayer = new AMap.TileLayer.Traffic({
        zIndex: 10,
      });
      // step4. 将图层添加到地图
      map.add(trafficLayer);
    </script>
  </body>
</html>
```

高德地图也同样支持异步加载，在对性能要求比较高的场景下，异步加载百度地图加快首屏的渲染速度。

```javascript
function init() {
  const map = new AMap.Map("container");
  // ......
}

window.onload = () => {
  const script = document.createElement("script");
  script.src = "https://webapi.amap.com/maps?v=1.4.15&key=您申请的key值&callback=onLoad";
  document.head.appendChild(script);
};
```

### 3.2 数据可视化

#### 3.2.1 基于 JS API

![](/images/docs/amap-basic.png)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>高德地图-基础案例</title>
    <script type="text/javascript">
      window._AMapSecurityConfig = {
        securityJsCode: "你的安全密钥",
      };
    </script>
    <script src="https://webapi.amap.com/maps?v=1.4.15&key=你的密钥"></script>
    <style>
      html,
      body {
        padding: 0;
        margin: 0;
        height: 100%;
        width: 100%;
      }
      #container {
        height: 100%;
        width: 100%;
      }
    </style>
  </head>
  <body>
    <div id="container"></div>
    <script>
      const map = new AMap.Map("container", {
        zoom: 12, //级别
        center: [116.397428, 39.90923], //中心点坐标
        // viewMode: "3D", //使用3D视图
      });

      // 点
      var marker = new AMap.Marker({
        icon: "https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        position: [116.406315, 39.908775],
        offset: new AMap.Pixel(-13, -30),
      });
      map.add(marker);

      // 文本 - 还有其他方法详见API文档
      var contentMarker = new AMap.Marker({
        position: [116.406315, 39.908775],
        offset: new AMap.Pixel(130, 0),
      });
      contentMarker.setMap(map);
      contentMarker.setContent("<div>hello world</div>"); //更新点标记内容

      // 线段
      var polyline = new AMap.Polyline({
        path: [
          [116.368904, 39.913423],
          [116.382122, 39.901176],
          [116.387271, 39.912501],
          [116.398258, 39.9046],
        ], //设置线覆盖物路径
        strokeColor: "#3366FF", //线颜色
        strokeWeight: 5, //线宽
        strokeStyle: "solid", //线样式
      });
      map.add(polyline);

      // 圆圈
      var circle = new AMap.Circle({
        center: new AMap.LngLat(116.39, 39.9), // 圆心位置
        radius: 1000, // 圆半径
        fillColor: "red", // 圆形填充颜色
        strokeColor: "#fff", // 描边颜色
        strokeWeight: 2, // 描边宽度
      });
      map.add(circle);

      // 点击事件和窗口
      marker.on("click", (e) => {
        infoWindow.open(map, e.target.getPosition()); // 打开信息窗体
      });
      var infoWindow = new AMap.InfoWindow({
        // 创建信息窗体
        isCustom: true, // 使用自定义窗体
        content: '<div style="color:red;">信息窗体</div>', // 信息窗体的内容可以是任意html片段
        offset: new AMap.Pixel(16, -45),
      });
    </script>
  </body>
</html>
```

#### 3.2.2 基于 LOCA

[Loca](https://lbs.amap.com/api/loca-v2/api) 是一个基于高德 JS API 地图、纯 JavaScript 实现的地理空间数据可视化渲染引擎。其特点是在无需了解高德 JS API 的情况下，通过灵活的配置，可以快速制作出如散点、轨迹、区面、热力图等地理位置相关的可视化作品。

![](/images/docs/amap-loca.png)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>高德地图-LOCA基础</title>
    <script type="text/javascript">
      window._AMapSecurityConfig = {
        securityJsCode: "你的安全密钥",
      };
    </script>
    <script src="https://webapi.amap.com/maps?v=1.4.15&key=你的密钥"></script>
    <script src="https://webapi.amap.com/loca?v=1.3.2&key=你的密钥"></script>
    <script src="https://a.amap.com/Loca/static/mock/districts.js"></script>
    <style>
      html,
      body {
        padding: 0;
        margin: 0;
        height: 100%;
        width: 100%;
      }
      #container {
        height: 100%;
        width: 100%;
      }
    </style>
  </head>
  <body>
    <div id="container"></div>
    <script>
      var map = new AMap.Map("container", {
        zoom: 4,
        center: [107.4976, 32.1697],
        features: ["bg", "road"],
      });

      var layer = new Loca.PointLayer({
        map: map,
      });

      layer.setData(districts, {
        // 指定经纬度所在字段
        lnglat: "center",
      });

      layer.setOptions({
        style: {
          // 圆形半径，单位像素
          radius: 5,
          // 填充颜色
          color: "#07E8E4",
          // 描边颜色
          borderColor: "#5DFBF9",
          // 描边宽度，单位像素
          borderWidth: 1,
          // 透明度 [0-1]
          opacity: 0.9,
        },
      });

      layer.render();
    </script>
  </body>
</html>
```

### 3.3 案例

此处不再展开，具体详见 [JS API-示例](https://lbs.amap.com/demo/list/js-api)， [LOCA-示例](https://lbs.amap.com/demo/list/loca-api)。

---

::: tip 数据可视化专题文章

1. [数据可视化之入门指南](./data-visualization-basic)
2. [数据可视化之 SVG 篇](./data-visualization-svg)
3. [数据可视化之 ECharts 篇](./data-visualization-echarts)
4. [数据可视化之地图篇](./data-visualization-map)
5. [数据可视化之项目示例](./data-visualization-projects)

如果有疑问，欢迎在 github 中提交 issues 或邮件 [sherwin_sw@163.com](mailto:sherwin_sw@163.com)

:::
