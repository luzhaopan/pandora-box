# plugin 

## 认识plugin

1. plugin是什么？

- plugin是插件的意思，通常是用于对某个现有的架构进行扩展。
- webpack中的插件，就是对webpack现有功能的各种扩展，比如打包优化，文件压缩等等。
  
2. loader和plugin区别

- loader主要用于转换某些类型的模块，它是一个转换器。

- plugin是插件，它是对webpack本身的扩展，是一个扩展器。

3. plugin的使用过程：

- 步骤一：通过npm安装需要使用的plugins(某些webpack已经内置的插件不需要安装)
- 步骤二：在webpack.config.js中的plugins中配置插件。

## 常用plugin

### html-webpack-plugin

1. 目前，我们的index.html文件是存放在项目的根目录下的。
2. 我们知道，在真实发布项目时，发布的是dist文件夹中的内容，但是dist文件夹中如果没有index.html文件，那么打包的js等文件也就没有意义了。
3. 所以，我们需要将index.html文件打包到dist文件夹中，这个时候就可以使HtmlWebpackPlugin插件


- 自动生成一个index.html文件(可以指定模板来生成)
- 自动将打包的js文件，自动通过script标签插入到body中

### clean-webpack-plugin

- 清理构建目录

### mini-css-extract-plugin

- 提取js中的css成单独文件

### uglifyjs-webpack-plugin

在项目发布之前，我们必然需要对js等文件进行压缩处理,这里，我们使用一个第三方的插件uglifyjs-webpack-plugin