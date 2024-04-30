# CSS中 link 和@import 的区别

1. link属于HTML标签，而@import是CSS提供的; 
2. 加载顺序：页面被加载的时，link会同时被加载，而@import引用的CSS会等到页面被加载完再加载;
3. 兼容性：import只在IE5以上才能识别，而link是HTML标签，无兼容问题; 
4. 权重：link方式的样式的权重 高于@import的权重：在link标签引入的 CSS 文件中，使用@import时需注意，如果已经存在相同样式，@import引入的这个样式将被该 CSS 文件本身的样式层叠掉，表现出link标签引入的样式权重大于@import引入的样式这样的直观效果。