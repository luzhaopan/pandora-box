# async和defer的区别

defer和async是script标签的两个属性，用于在不阻塞页面文档解析的前提下，控制脚本的下载和执行。

## async
- 异步加载，加载完立即执行
- 不保证加载顺序
- 不阻塞HTML解析
- 适用于加载不依赖DOM的脚本

## defer
- 异步加载，加载完等待HTML解析完再执行
- 保证加载顺序
- 阻塞HTML解析
- 适用于加载依赖DOM的脚本

## 区别
- async和defer都表示异步加载，但是async是加载完立即执行，defer是加载完等待HTML解析完再执行
- async不保证加载顺序，defer保证加载顺序

- 虽然async是异步加载，会阻塞dom元素的解析，并且执行顺序是无序的，谁先加载完谁先执行！有可能在DOMContentLoaded事件之前执行，也可能在DOMContentLoaded事件之后执行，但是一定在onload事件之前执行

- 当浏览器遇到带有 defer 属性的 script 时，获取该脚本的网络请求也是异步的，不会阻塞浏览器解析 HTML，一旦网络请求回来之后，如果此时 HTML 还没有解析完，浏览器不会暂停解析并执行 JS 代码，而是等待 HTML 解析完毕再执行 JS 代码

- defer属性的脚本是在页面解析完成后，按照顺序执行，同时会在document的DOMContentLoaded之前执行。

虽然是异步加载，但是不会阻塞dom元素的解析，并且严格按照书写顺序执行！

总体来说，defer和async的主要不同就是defer会保证脚本的顺序，async不保证顺序