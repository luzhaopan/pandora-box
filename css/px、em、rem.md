# px、em、rem

相同点：px和em都是长度单位；

异同点：
1. px的值是固定的，指定是多少就是多少，计算比较容易。
2. em的值不是固定的，并且em会继承父级元素的字体大小。

em和rem的区别
1. rem是相对于根元素进行计算，而em是相对于当前元素或父元素的字体大小。
2. rem不仅可以设置字体的大小，还支持元素宽、高等属性。
3. em是相对于当前元素或父元素进行换算，层级越深，换算越复杂。而rem是相对于根元素计算，避免层级关系。
   
浏览器的默认字体高都是16px。所以未经调整的浏览器都符合: 1em=16px。那么12px=0.75em, 10px=0.625em。

1. px像素。绝对单位，像素px是相对于显示器屏幕分辨率而言的，是一个虚拟单位。是计算机系统的数字化图像长度单位，如果px要换算成物理长度，需要指定精度DPI。
   
2. em是相对长度单位，相对于当前对象内文本的字体尺寸。 em 单位只相对于目标元素的直接父元素，如当前行内文本的字体尺寸未被人为设置，则相对浏览器的默认字体尺寸。它会继承父级元素的字体大小，因此并不是一个固定的值。
```sh
<div class="parent">
  I'm parent div set to 16px
  <div class="child">
    I'm the child div set to 2em, 2em = 32px.
  </div>
</div>
```
   
3. rem是CSS3新增的一个相对单位(root em,根em),使用rem为元素设定字体大小事，仍然是相对大小但相对的只是HTML根元素。
   
4. 区别：IE无法调用那些使用px作为单位的字体大小，而em和rem可以缩放，rem相对的只是HTML根元素。这个单位可谓集相对大小和绝对大小的优点于一身，通过它既可以做到只修改根元素就成比例地调整所有字体大小，又可以避免字体大小逐层复合的连锁反应。目前，除了IE8及更早版本外，所有浏览器已支持rem。


```sh
// 修改根元素的font-size，适配rem
const setHtmlFontSize = () => {
  const htmlDom = document.getElementsByTagName('html')[0]
  const htmlWidth =
    document.documentElement.clientWidth || document.body.clientWidth
  const fontSize = htmlWidth / 133.33333333333334
  htmlDom.style.fontSize = `${fontSize > 10 ? fontSize : 10}px`
}
window.onresize = setHtmlFontSize
setHtmlFontSize()
```