# SSR

SSR（Server-Side Rendering）也就是服务端渲染，也就是将Vue在客户端把标签渲染成HTML的工作放在服务端完成，然后再把html直接返回给客户端。

主要用于解决SEO(搜索引擎优化)和首屏加载速度问题。

## SSR实现原理

1. 服务端渲染的Vue组件和客户端渲染的Vue组件是不同的，服务端渲染的Vue组件需要包含`renderToString`方法，而客户端渲染的Vue组件需要包含`render`方法。

2. 服务端渲染的Vue组件需要使用`vue-server-renderer`包，而客户端渲染的Vue组件需要使用`vue`包。

3. 服务端渲染的Vue组件需要使用`vue-server-renderer`包的`createRenderer`方法创建一个渲染器，然后使用`renderToString`方法将Vue组件渲染成HTML字符串。

4. 客户端渲染的Vue组件需要使用`vue`包的`createApp`方法创建一个应用，然后使用`mount`方法将Vue组件挂载到DOM上。

5. 服务端渲染的Vue组件和客户端渲染的Vue组件都需要使用`vue-router`包来管理路由。

## SSR实现步骤

1. 安装`vue-server-renderer`包和`vue-router`包。

2. 创建一个Vue组件，并使用`vue-server-renderer`包的`createRenderer`方法创建一个渲染器。

3. 创建一个Vue应用，并使用`vue-router`包来管理路由。

4. 在服务端渲染的Vue组件中使用`renderToString`方法将Vue组件渲染成HTML字符串，并将HTML字符串返回给客户端。

5. 在客户端渲染的Vue组件中使用`vue`包的`createApp`方法创建一个应用，并使用`mount`方法将Vue组件挂载到DOM上。



                        
