# React 中 setState 后发生了什么？

React设计setState方法就是为了重新渲染页面

```sh
setState(updater, [callback])
```
如果需要在setState()后获取最新的状态数据, 在第二个callback函数中读取

1. 在代码中调用setState函数之后，React 会将传入的参数对象与组件当前的状态合并，然后触发所谓的调和过程（Reconciliation）。

2. 经过调和过程，React 会以相对高效的方式根据新的状态构建 React 元素树并且着手重新渲染整个UI界面。

3. 在 React 得到元素树之后，React 会自动计算出新的树与老树的节点差异，然后根据差异对界面进行最小化重渲染。

在差异计算算法中，React 能够相对精确地知道哪些位置发生了改变以及应该如何改变，这就保证了按需更新，而不是全部重新渲染。


# setState 为什么默认是异步？setState 什么时候是同步？ 

在 React 中，如果是由 React 引发的事件处理（比如通过 onClick 引发的事件处理），调用 setState 不会同步更新 this.state，除此之外的 setState 调用会同步执行 this.state。


所谓除此之外，指的是绕过 React 通过 addEventListener 直接添加的事件处理函数，还有通过 setTimeout/setInterval 产生的异步调用。


原因：
在 React 的 setState 函数实现中，会根据一个变量 isBatchingUpdates 判断是直接更新 this.state 还是放到队列中回头再说，而 isBatchingUpdates 默认是 false，也就表示 setState 会同步更新 this.state，但是，有一个函数 batchedUpdates，这个函数会把 isBatchingUpdates 修改为 true，而当 React 在调用事件处理函数之前就会调用这个 batchedUpdates，造成的后果，就是由React控制的事件处理过程 setState 不会同步更新this.state。


注意：
setState 的异步并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形式了所谓的异步，当然可以通过第二个参数setState(partialState, callback) 中的 callback 拿到更新后的结果。