# BFC 块级格式化上下文

## 什么是 BFC

BFC 是 Block Formatting Context 的缩写，即块级格式化上下文，它是 Web 页面中盒模型布局的 CSS 渲染模式，指一个独立的渲染区域，只有块级元素参与，它规定了内部的 Block-Level Box 如何布局，并且与这个区域外部毫不相干。

## BFC 的特性

1. BFC 内部的 Box 会在垂直方向上一个接一个的放置
2. Box 垂直方向的距离由 margin 决定，属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠
3. BFC 区域不会与 float box 重叠
4. BFC 是页面上的一个独立容器，容器里面的子元素不会影响到外面的元素。反之也如此
5. 计算 BFC 的高度时，浮动元素也参与计算

## 如何创建 BFC

1. 根元素
2. float 的值不为 none
3. overflow 的值不为 visible
4. display 的值为 inline-block、table-cell、table-caption
5. position 的值为 absolute 或 fixed

## BFC 的应用

1. 清除浮动
2. 防止 margin 重叠
3. 实现多栏布局 