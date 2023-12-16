# React 和 Vue

# 相似之处：

1、都将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库；

2、都有自己的构建工具，能让你得到一个根据最佳实践设置的项目模板；

3、都使用了Virtual DOM（虚拟DOM）提高重绘性能；

4、都有props的概念，允许组件间的数据传递；

5、都鼓励组件化应用，将应用分拆成一个个功能明确的模块，提高复用性。

# 不同之处 ：

## 1.数据流

Vue默认支持数据双向绑定，而React一直提倡单向数据流

## 2.虚拟DOM

Vue2.x开始引入"Virtual DOM"，消除了和React在这方面的差异，但是在具体的细节还是有各自的特点。

1)Vue宣称可以更快地计算出Virtual DOM的差异，这是由于它在渲染过程中，会跟踪每一个组件的依赖关系，不需要重新渲染整个组件树。

2)对于React而言，每当应用的状态被改变时，全部子组件都会重新渲染。当然，这可以通过 PureComponent/shouldComponentUpdate这个生命周期方法来进行控制，但Vue将此视为默认的优化。

## 3.组件化

React与Vue最大的不同是模板的编写。

1、Vue鼓励写近似常规HTML的模板。写起来很接近标准 HTML元素，只是多了一些属性。

2、React推荐你所有的模板通用JavaScript的语法扩展——JSX书写。

具体来讲：React中render函数是支持闭包特性的，所以import的组件在render中可以直接调用。但是在Vue中，由于模板中使用的数据都必须挂在 this 上进行一次中转，所以 import 一个组件完了之后，还需要在 components 中再声明下。

## 4.监听数据变化的实现原理不同

1、Vue 通过 getter/setter 以及一些函数的劫持，能精确知道数据变化，不需要特别的优化就能达到很好的性能

2、React 默认是通过比较引用的方式进行的，如果不优化（PureComponent/shouldComponentUpdate）可能导致大量不必要的vDOM的重新渲染。这是因为 Vue 使用的是可变数据，而React更强调数据的不可变。

## 5.高阶组件

react可以通过高阶组件（HOC）来扩展，而Vue需要通过mixins来扩展。

高阶组件就是高阶函数，而React的组件本身就是纯粹的函数，所以高阶函数对React来说易如反掌。相反Vue.js使用HTML模板创建视图组件，这时模板无法有效的编译，因此Vue不能采用HOC来实现。

## 6.构建工具

两者都有自己的构建工具：

1、React ==> Create React APP

2、Vue ==> vue-cli  

2、Vite ==> pnpm create vite   https://cn.vitejs.dev/guide/

7.跨平台

1、React ==> React Native

2、Vue ==> Weex