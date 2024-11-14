# React 和 Vue

# 相似之处：

1、都将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库；

2、都有自己的构建工具，能让你得到一个根据最佳实践设置的项目模板；

3、都使用了Virtual DOM（虚拟DOM）提高重绘性能；

4、都有props的概念，允许组件间的数据传递；

5、都鼓励组件化应用，将应用分拆成一个个功能明确的模块，提高复用性。

# 不同之处 ：

## 1.数据绑定

1. Vue: Vue使用双向数据绑定，这意味着当模型数据改变时，视图会自动更新，反之亦然。Vue的模板语法简洁，易于理解。
2. React: React使用单向数据流，即数据从父组件流向子组件，子组件不能直接修改父组件的状态。React推荐使用状态管理库（如Redux）来处理复杂的状态逻辑。

## 2.虚拟DOM

Vue2.x开始引入"Virtual DOM"，消除了和React在这方面的差异，但是在具体的细节还是有各自的特点。

1) Vue宣称可以更快地计算出Virtual DOM的差异，这是由于它在渲染过程中，会跟踪每一个组件的依赖关系，不需要重新渲染整个组件树。

2) 对于React而言，每当应用的状态被改变时，全部子组件都会重新渲染。当然，这可以通过 PureComponent/shouldComponentUpdate这个生命周期方法来进行控制，但Vue将此视为默认的优化。

## 3.组件化

1. Vue: Vue鼓励通过组件化的方式构建应用，每个组件都有自己的状态、方法和模板。Vue的组件系统非常强大，支持单文件组件（.vue文件）。
2. React: React也采用组件化的方式，每个组件都有自己的状态和属性。React组件通常使用JSX语法来定义，JSX是一种JavaScript的语法扩展，允许你在JavaScript代码中写类似HTML的标记。

## 4. 模板语法

1. Vue: Vue使用基于HTML的模板语法，使得模板易于理解和编写。Vue还支持指令（如v-if、v-for、v-bind等）来处理常见的逻辑和操作。
2. React: React使用JSX语法，这是一种JavaScript的语法扩展，允许你在JavaScript代码中写类似HTML的标记。JSX需要被Babel等编译器转换为JavaScript代码。

## 5.监听数据变化的实现原理不同

1、Vue 通过 getter/setter 以及一些函数的劫持，能精确知道数据变化，不需要特别的优化就能达到很好的性能

2、React 默认是通过比较引用的方式进行的，如果不优化（PureComponent/shouldComponentUpdate）可能导致大量不必要的vDOM的重新渲染。这是因为 Vue 使用的是可变数据，而React更强调数据的不可变。

## 6.高阶组件

react可以通过高阶组件（HOC）来扩展，而Vue需要通过mixins来扩展。

高阶组件就是高阶函数，而React的组件本身就是纯粹的函数，所以高阶函数对React来说易如反掌。相反Vue.js使用HTML模板创建视图组件，这时模板无法有效的编译，因此Vue不能采用HOC来实现。

## 7. 路由

1. Vue: Vue Router是Vue官方的路由管理器，提供了丰富的路由功能，如嵌套路由、动态路由、路由守卫等。
2. React: React Router是React社区广泛使用的路由库，提供了类似的功能，但需要更多的配置和代码。
   
## 8.状态管理

1. Vue: Vue官方推荐使用Vuex进行状态管理，Vuex是一个专为Vue.js应用程序开发的状态管理模式。
2. React: React社区有多种状态管理库可供选择，如Redux、MobX等。Redux是React官方推荐的状态管理库，提供了可预测的状态管理。

## 9. 性能

1. Vue: Vue的性能优化主要体现在虚拟DOM和响应式系统上，Vue 3引入了Composition API，进一步提高了性能和灵活性。
2. React: React的性能优化主要体现在虚拟DOM和Fiber架构上，React 18引入了并发特性，使得React应用可以更好地处理高并发场景。

## 10.构建工具

两者都有自己的构建工具：

1、React ==> Create React APP

2、Vue ==> vue-cli  

2、Vite ==> pnpm create vite   https://cn.vitejs.dev/guide/

7.跨平台

1、React ==> React Native

2、Vue ==> Weex

## 11. 社区与生态系统

1. Vue: Vue拥有一个庞大且活跃的社区，提供了丰富的插件和工具，如Vue CLI、Vue Router、Vuex等。
2. React: React也有一个庞大的社区，提供了大量的库和工具，如React Router、Redux、React Native等。

## 12. 学习曲线

1. Vue: Vue的学习曲线相对较平缓，特别是对于有HTML、CSS和JavaScript基础的开发者来说。
2. React: React的学习曲线相对较陡峭，特别是对于初学者来说，需要理解JSX、React Hooks等概念。