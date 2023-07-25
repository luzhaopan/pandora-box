webpack是用JS写的，运行在node环境，所以默认webpack打包的时候只会处理JS之间的依赖关系！！！

# file-loader 和 url-loader 

webpack对png等图片静态资源打包用到的插件，对图片路径的处理方法常用的有两种，一种是file-loader，一种是url-loader。

url-loader 封装了 file-loader。url-loader 不依赖于 file-loader，即使用 url-loader 时，只需要安装 url-loader 即可，不需要安装 file-loader，因为 url-loader 内置了 file-loader。

简单点说url-loader包含了file-loader，通过限定一个图片的大小（limit），来判断是否采用编码的方式。小于limit的时候使用base64进行压缩，大于则使用file-loader变成路径。

## file-loader

作用：

1. 指定输出文件的路径——即打包后文件的存储位置。

2. 生成解析文件的路径——即打包后引用文件时的URL地址。

3. 返回一个字符串形式的 JS 模块，加载这个模块，就可以得到文件路径；

## url-loader 工作情况
通过上面的介绍，我们可以看到，url-loader 工作分两种情况：

1. 文件大小 < limit 参数，url-loader 将会把文件转为 DataURL；

2. 文件大小 > limit参数，url-loader 会调用 file-loader 进行处理，参数也会直接传给 file-loader。

ps. 因此通常只需要安装 url-loader 即可。
把字体文件转成 base64 是浏览器无法识别的，这是错误的操作.


# css-loader 和style-loader

传统上我们会在html文件中引入CSS代码，借助webpack style-loader和css-loader我们可以在.js文件中引入css文件并让样式生效。

css-loader的作用是将css文件转换成webpack能够处理的资源，而style-loader就是帮我们直接将css-loader解析后的内容挂载到html页面当中

