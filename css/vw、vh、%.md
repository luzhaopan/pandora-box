# height: 100vh & height: 100%  width: 100vw & width: 100%

vw和vh分别代表视口宽度和视口高度。

vw和%的区别为：

单位含义%大部分相对于祖先元素，也有相对于自身的情况比如（border-radius、translate等)vw/vh相对于视窗的尺寸

从对比中我们可以发现，vw单位与百分比类似，单确有区别，前面我们介绍了百分比单位的换算困难，这里的vw更像"理想的百分比单位"。任意层级元素，在使用vw单位的情况下，1vw都等于视图宽度的百分之一。


# px和视口
在静态网页中，我们经常用像素（px）作为单位，来描述一个元素的宽高以及定位信息。在pc端，通常认为css中,1px所表示的真实长度是固定的。

px的值与设备有关，pc端下和移动端下设置的font-size统一为16px，但是显示结果却不一样。

那么在pc端，一个css像素可以如下计算：

PC端： 1 CSS像素 = 物理像素／分辨率 = 750 ／ 980 =0.76 px

而在iphone6下：

iphone6：1 CSS像素 = 物理像素 ／分辨率 = 750 ／ 375 = 2 px

# 自适应方案

## 媒体查询

使用@media媒体查询可以针对不同的媒体类型定义不同的样式，特别是响应式页面，可以针对不同屏幕的大小，编写多套样式，从而达到自适应的效果。举例来说：
```sh
@media screen and (max-width: 960px){
    body{
      background-color:#FF6699
    }
}

@media screen and (max-width: 768px){
    body{
      background-color:#00FF66;
    }
}

@media screen and (max-width: 550px){
    body{
      background-color:#6633FF;
    }
}

@media screen and (max-width: 320px){
    body{
      background-color:#FFFF00;
    }
}
```
但是媒体查询的缺点也很明显，如果在浏览器大小改变时，需要改变的样式太多，那么多套样式代码会很繁琐。

## 百分比 （有继承关系）

除了用px结合媒体查询实现响应式布局外，我们也可以通过百分比单位 " % " 来实现响应式的效果。

比如当浏览器的宽度或者高度发生变化时，通过百分比单位，通过百分比单位可以使得浏览器中的组件的宽和高随着浏览器的变化而变化，从而实现响应式的效果。


1. 百分比的具体分析
（1）子元素height和width的百分比

子元素的height或width中使用百分比，是相对于子元素的直接父元素，width相对于父元素的width，height相对于父元素的height。比如：

```sh
<div class="parent">
  <div class="child"></div>
</div>
```

(2) top和bottom 、left和right

子元素的top和bottom如果设置百分比，则相对于直接非static定位(默认定位)的父元素的高度，同样

子元素的left和right如果设置百分比，则相对于直接非static定位(默认定位的)父元素的宽度。

（3）padding

子元素的padding如果设置百分比，不论是垂直方向或者是水平方向，都相对于直接父亲元素的width，而与父元素的height无关。

（4）margin

跟padding一样，margin也是如此，子元素的margin如果设置成百分比，不论是垂直方向还是水平方向，都相对于直接父元素的width。这里就不具体举例。

（5）border-radius

border-radius不一样，如果设置border-radius为百分比，则是相对于自身的宽度.

除了border-radius外，还有比如translate、background-size等都是相对于自身的

2. 百分比单位布局应用
百分比单位在布局上应用还是很广泛的，这里介绍一种应用。

比如我们要实现一个固定长宽比的长方形，比如要实现一个长宽比为4:3的长方形,我们可以根据padding属性来实现，因为padding不管是垂直方向还是水平方向，百分比单位都相对于父元素的宽度，因此我们可以设置padding-top为百分比来实现，长宽自适应的长方形：

<div class="trangle"></div>
设置样式让其自适应：

.trangle{
  height:0;
  width:100%;
  padding-top:75%;
}
通过设置padding-top：75%,相对比宽度的75%，因此这样就设置了一个长宽高恒定比例的长方形

3. 百分比单位缺点
从上述对于百分比单位的介绍我们很容易看出如果全部使用百分比单位来实现响应式的布局，有明显的以下两个缺点：

（1）计算困难，如果我们要定义一个元素的宽度和高度，按照设计稿，必须换算成百分比单位。 （2）从小节1可以看出，各个属性中如果使用百分比，相对父元素的属性并不是唯一的。比如width和height相对于父元素的width和height，而margin、padding不管垂直还是水平方向都相对比父元素的宽度、border-radius则是相对于元素自身等等，造成我们使用百分比单位容易使布局问题变得复杂。

## rem单位

1. 修改根元素
通过rem来实现响应式的布局，只需要根据视图容器的大小，动态的改变font-size即可。

```sh
function refreshRem() {
    var docEl = doc.documentElement;
    var width = docEl.getBoundingClientRect().width;
    var rem = width / 10;
    docEl.style.fontSize = rem + 'px';
    flexible.rem = win.rem = rem;
}
win.addEventListener('resize', refreshRem);
```
2. rem2px和px2rem 

1) webpack loader的形式
```sh
npm install px2rem-loader

module.exports = {
  // ...
  module: {
    rules: [{
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'px2rem-loader',
        // options here
        options: {
          remUni: 75,
          remPrecision: 8
        }
      }]
    }]
  }
```

2）webpack中使用postcss plugin

npm install postcss-loader
在webpack的plugin中:

var px2rem = require('postcss-px2rem');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader!postcss-loader"
      }
    ]
  },
  postcss: function() {
    return [px2rem({remUnit: 75})];
  }
}

## vw、vh （只和设备的宽度/高度有关）

css3中引入了一个新的单位vw/vh，与视图窗口有关，vw表示相对于视图窗口的宽度，vh表示相对于视图窗口高度，除了vw和vh外，还有vmin和vmax两个相关的单位。各个单位具体的含义如下：

单位含义vw相对于视窗的宽度，视窗宽度是100vwvh相对于视窗的高度，视窗高度是100vhvminvw和vh中的较小值vmaxvw和vh中的较大值

这里我们发现视窗宽高都是100vw／100vh，那么vw或者vh，下简称vw，很类似百分比单位。vw和%的区别为：

单位含义%大部分相对于祖先元素，也有相对于自身的情况比如（border-radius、translate等)vw/vh相对于视窗的尺寸

