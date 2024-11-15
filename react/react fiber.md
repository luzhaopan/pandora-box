# react fiber

尽管 React 在性能和开发效率方面取得了很大的成功，但随着应用规模和复杂度的增加，传统的React 架构在处理高频更新和复杂组件树时开始暴露出一些性能瓶颈。例如，在用户交互频繁或者需要大规模更新时，界面的响应速度会受到影响。为了解决这些问题，React 团队在 2017 年（React v16）引入了全新的 Fiber 架构。这是一种全新的协调引擎，旨在提高 React 应用的性能，尤其是在复杂和高频更新的场景下。

1. 在Fiber出现之前React存在什么问题
- React16之前的Reconciler采用递归的方式执行，数据保存在递归调用栈中，所以被称为stack Reconciler。
- React16的Reconciler基于Fiber节点实现，被称为Fiber Reconciler，各个 FiberNode 之间通过链表的形式串联起来。

在React15版本中采用的是Virtual DOM对比方案，通过对比Virtual DOM找出差异部分，从而只将差异部分更新到页面中，避免更新整体DOM以提高性能。

在Virtual DOM 比对的过程中React使用了递归，递归调用的过程不能被终止，如果Virtual DOM的层级比较深，递归比对的过程就会长期占用主线程，而 JavaScript又是单线程，不能同时执行多个任务，其他任务只能等待执行，而且JavaScript的执行和UI的渲染又是互斥的，此时用户要么看到的就是空白界面，要么就是有界面但是不能响应用户操作，处干卡顿状态，用户体验差。

2. Fiber 如何解决性能问题
在 Fiber 架构中 React 放弃了递归调用，采用循环来模拟递归，因为循环可以随时被中断。

React 利用浏览器空闲时间执行比对任务，绝不占用主线程。 解决了 React 执行比对任务长期占用主线程的问题。

React 在执行完一个任务单元后，查看是否有其他的高优先级任务，如果有，放弃占用主线程，先执行优先级高的任务。

## 一、Fiber 概念

Fiber 架构的核心概念是 Fiber 节点。每个组件或元素在 Fiber 架构中都会对应一个 Fiber 节点。Fiber 节点包含了组件的状态、属性、以及与渲染过程相关的其他信息。Fiber 节点通过链表结构连接在一起，形成了一棵 Fiber 树。这个树状结构使得 React 可以在渲染过程中更灵活地中断、恢复和重新排序工作。

当我们写React组件并使用JSX时，React在底层会将JSX转换为元素的对象结构。

```js
const element = <h1>Hello, world</h1>;
```

上述代码会被转换为以下形式：

```js
const element = React.createElement(
  'h1',
  null,
  'Hello, world'
);
```

为了将这个元素渲染到DOM上，React需要创建一种内部实例，用来追踪该组件的所有信息和状态。在早期版本的React中，我们称之为“实例”或“虚拟DOM对象”。但在Fiber架构中，这个新的工作单元就叫做Fiber。

所以，在本质上，Fiber是一个JavaScript对象，代表React的一个工作单元，它包含了与组件相关的信息。一个简化的Fiber对象长这样：

```js
{
  type: 'h1',  // 组件类型
  key: null,   // React key
  props: { ... }, // 输入的props
  state: { ... }, // 组件的state (如果是class组件或带有state的function组件)
  child: Fiber | null,  // 第一个子元素的Fiber
  sibling: Fiber | null,  // 下一个兄弟元素的Fiber
  return: Fiber | null,  // 父元素的Fiber
  // ...其他属性
}

```

Fiber对象包含了组件的类型（type）、属性（props）以及一些其他属性，如状态、副作用等。这些属性使得React可以在渲染过程中追踪组件的状态和变化，从而实现高效的更新和渲染。

## 二、Fiber 树

Fiber 树是 Fiber 架构的核心数据结构。它是由 Fiber 节点组成的树状结构，每个 Fiber 节点都代表了一个组件或元素。Fiber 树的构建过程是在调和阶段（Reconciliation）中进行的。

在调和阶段，React 会遍历 Fiber 树，计算出需要更新的部分。这个阶段是可中断的，React 可以在完成一部分工作后暂停，等待主线程上的其他任务完成后再继续。这种机制使得 React 在处理高优先级任务时可以优先响应，从而提高应用的响应速度。

### Fiber的结构
```js
function FiberNode(
  this: $FlowFixMe,
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 基本属性 静态的数据结构
  // 对应一个React element，保存了该组件的类型（函数组件/类组件/原生组件…）、对应的 DOM 节点等信息。
  this.tag = tag; // 描述此Fiber的启动模式的值（LegacyRoot = 0; ConcurrentRoot = 1）
  this.key = key; // React key
  this.elementType = null; // 描述React元素的类型。例如，对于JSX<App />，elementType是App
  this.type = null; // 组件类型
  this.stateNode = null; // 对于类组件，这是类的实例；对于DOM元素，它是对应的DOM节点。

  // Fiber链接
  this.return = null; // 指向父Fiber
  this.child = null; // 指向第一个子Fiber
  this.sibling = null; // 指向其兄弟Fiber
  this.index = 0; // 子Fiber中的索引位置

  this.ref = null; // 如果组件上有ref属性，则该属性指向它
  this.refCleanup = null; // 如果组件上的ref属性在更新中被删除或更改，此字段会用于追踪需要清理的旧ref

    // Props & State 动态的工作单元
    // 保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新…）。
  this.pendingProps = pendingProps; // 正在等待处理的新props
  this.memoizedProps = null; // 上一次渲染时的props
  this.updateQueue = null; // 一个队列，包含了该Fiber上的状态更新和副作用
  this.memoizedState = null; // 上一次渲染时的state
  this.dependencies = null; // 该Fiber订阅的上下文或其他资源的描述

    // 工作模式
  this.mode = mode; // 描述Fiber工作模式的标志（例如Concurrent模式、Blocking模式等）。

  // Effects
  this.flags = NoFlags; // 描述该Fiber发生的副作用的标志（十六进制的标识）
  this.subtreeFlags = NoFlags; // 描述该Fiber子树中发生的副作用的标志（十六进制的标识）
  this.deletions = null; // 在commit阶段要删除的子Fiber数组

  this.lanes = NoLanes; // 与React的并发模式有关的调度概念。
  this.childLanes = NoLanes; // 与React的并发模式有关的调度概念。

  this.alternate = null; // Current Tree和Work-in-progress (WIP) Tree的互相指向对方tree里的对应单元

    // 如果启用了性能分析
  if (enableProfilerTimer) {
    // ……
  }

    // 开发模式中
  if (__DEV__) {
    // ……
  }
}

```

## 三、Fiber 的工作原理

Fiber 架构的工作原理基于两个阶段：调和阶段（Reconciliation）和提交阶段（Commit）。

1. 调和阶段：在这个阶段，React 会遍历 Fiber 树，计算出需要更新的部分。这个阶段是可中断的，React 可以在完成一部分工作后暂停，等待主线程上的其他任务完成后再继续。这种机制使得 React 在处理高优先级任务时可以优先响应，从而提高应用的响应速度。
2. 提交阶段：在这个阶段，React 会将调和阶段计算出的需要更新的部分应用到实际的 DOM 上。这个阶段是不可中断的，因为一旦开始，就必须完成所有的工作。提交阶段的工作包括更新 DOM、处理副作用等。
3. 双缓冲技术：Fiber 架构还引入了双缓冲技术，即同时维护两棵 Fiber 树：当前树（current tree）和双缓冲树（work-in-progress tree）。在调和阶段，React 会构建双缓冲树，并在完成之后将双缓冲树切换为当前树。这种机制可以避免在渲染过程中频繁地操作 DOM，从而提高性能。
4. 优先级调度：Fiber 架构还引入了优先级调度机制，根据任务的紧急程度分配不同的优先级。React 可以根据优先级来决定任务的执行顺序，从而提高应用的响应速度。

## 四、Fiber 的优点

1. 可中断和恢复：Fiber 架构允许 React 在调和阶段中断工作，等待主线程上的其他任务完成后再继续。这种机制使得 React 在处理高优先级任务时可以优先响应，从而提高应用的响应速度。
2. 更细粒度的更新：Fiber 架构将更新过程分解为多个小任务，每个任务只处理一部分更新。这种机制使得 React 可以更细粒度地控制更新过程，从而提高性能。
