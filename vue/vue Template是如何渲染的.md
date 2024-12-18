# vue Template是如何渲染的

## 1. 模板编译

### 1.1 模板编译过程

模板编译过程主要分为三个阶段：parse、optimize、generate。

- parse（解析）：将模板字符串解析成抽象语法树（AST）。
- optimize（优化）：对AST进行优化，标记静态节点，以便在后续的渲染过程中跳过这些节点的更新。
- generate（代码生成）：将AST转换成渲染函数，渲染函数是一个函数，接收一些数据作为参数，并返回一个虚拟DOM（Virtual DOM）。

### 1.2 模板编译的步骤

模板编译的步骤如下：

1. 将模板字符串解析成抽象语法树（AST）。这一步主要是将模板字符串转换成AST，AST是一个树状结构，每个节点代表模板中的一个元素或属性。
2. 对AST进行优化。这一步主要是标记静态节点，以便在后续的渲染过程中跳过这些节点的更新。
3. 将AST转换成渲染函数。这一步主要是将AST转换成渲染函数，渲染函数是一个函数，接收一些数据作为参数，并返回一个虚拟DOM（Virtual DOM）。
4. 将渲染函数应用到Vue实例上，生成虚拟DOM，并将虚拟DOM渲染成真实DOM。
5. 当数据发生变化时，重新执行渲染函数，生成新的虚拟DOM，并将新的虚拟DOM与旧的虚拟DOM进行比较，找出差异，然后只更新差异部分。
6. 将新的虚拟DOM渲染成真实DOM。


## 2. 虚拟DOM

### 2.1 虚拟DOM的概念

虚拟DOM（Virtual DOM）是一种用于描述DOM结构的JavaScript对象。它是一个树状结构，每个节点代表一个DOM元素或属性。虚拟DOM的主要作用是减少对真实DOM的操作次数，提高页面的渲染性能。

### 2.2 虚拟DOM的原理
虚拟DOM的原理是通过比较两个虚拟DOM树的差异，找出需要更新的部分，然后只更新这些部分，而不是更新整个虚拟DOM树。具体来说，虚拟DOM会先比较两个虚拟DOM树的根节点，如果根节点相同，则递归比较子节点；如果根节点不同，则直接替换整个虚拟DOM树。

### 2.3 虚拟DOM的优点

虚拟DOM的优点如下：

1. 减少对真实DOM的操作次数，提高页面的渲染性能。
2. 可以将虚拟DOM转换为真实DOM，方便进行调试和测试。
3. 可以将虚拟DOM转换为其他格式的数据，如JSON，方便进行数据传输和存储。

### 2.4 虚拟DOM的缺点

虚拟DOM的缺点如下：
1. 需要额外的内存空间来存储虚拟DOM。
2. 需要额外的计算时间来生成虚拟DOM。
3. 需要额外的计算时间来比较虚拟DOM的差异。

## 3. diff算法

### 3.1 diff算法的概念

diff算法是一种用于比较两个虚拟DOM树的算法。它通过比较两个虚拟DOM树的差异，找出需要更新的部分，然后只更新这些部分，而不是更新整个虚拟DOM树。

### 3.2 diff算法的原理
diff算法的原理是通过比较两个虚拟DOM树的差异，找出需要更新的部分，然后只更新这些部分，而不是更新整个虚拟DOM树。具体来说，diff算法会先比较两个虚拟DOM树的根节点，如果根节点相同，则递归比较子节点；如果根节点不同，则直接替换整个虚拟DOM树。

## 4. ast
### 4.1 ast的概念

抽象语法树（Abstract Syntax Tree，AST）是一种用于描述程序结构的树状数据结构。它将源代码解析成树状结构，每个节点代表源代码中的一个元素或属性。AST的主要作用是用于代码分析和转换，如代码压缩、代码优化、代码转换等。

这种数据结构其实就是一个大的json对象，json我们都熟悉，他就像一颗枝繁叶茂的树。有树根，有树干，有树枝，有树叶，无论多小多大，都是一棵完整的树。

简单理解,就是把我们写的代码按照一定的规则转换成一种树形结构。

```js
<div id="app">Hello</div>
```
上面的代码转换成AST之后，大概长这样：
```js
{
  "type": "Element",
  "tag": "div",
  "attrs": [
    {
      "name": "id",
      "value": "app"
    }
  ],
  "children": [
    {
      "type": "Text",
      "text": "Hello"
    }
  ]
}
```
可以看到，AST的结构和HTML的结构非常相似，每个节点都代表一个HTML元素或属性。

