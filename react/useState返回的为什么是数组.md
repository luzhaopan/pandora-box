# useState 用法

```sh
const [count, setCount] = useState(0)
```
这里可以看到 useState 返回的是一个数组，那么为什么是返回数组而不是返回对象呢？我们在自定义 hook 时应该返回什么类型呢？

要弄懂这个问题要先明白 ES6 的解构赋值，来看 2 个简单的例子：


数组的解构赋值
```sh
const foo = [1, 2, 3];

const [one, two, three] = foo;
console.log(one);	// 1
console.log(two);	// 2
console.log(three);	// 3
```


对象的解构赋值

```sh
const user = {
  id: 1,
  name: "hahaha"
};

const { id, name } = user;
console.log(id);	// 1
console.log(name);	// "hahaha"
```

搞清楚了解构赋值，那上面的问题就比较好解释了

如果 useState 返回数组，那么可以顺便对数组中的变量命名，代码看起来也比较干净

而如果是对象的话返回的值必须和 useState 内部实现返回的对象同名，

这样只能在 function component 中使用一次，想要多次使用 useState 必须得重命名返回值。

```sh
// 第一次使用
const { state, setState } = useState(false)
// 第二次使用
const { state: counter, setState: setCounter} = useState(0)
```

当然事情总是有两面性的，使用 array 也存在一些问题：

返回值强顺序，灵活性比较低。array[0] 为值，array[1] 为改变值的方法。
返回的值基本都得使用，对于有些返回值不想使用的话代码看起来有些怪，比如只想用 setState, 就得这么写：const [, setState] = useState(false)。
返回的参数不能太多，否则处理上面 2 个场景会很麻烦。
如果在自定义的Hook中遇到了以上几个问题，不妨试试返回 object。

## 简单总结一下，

在自定义 hook 的时候可以遵循一个简单原则：

当参数大于 2 个的时候返回值的类型返回 object， 否则返回数组。

# 两者都支持，让 object 行为像 array 一样

数组是由带有数字下标和一些 prototype 组成的对象，我们在 object 中来模拟一下 array：

```sh
const data = {
  foo: 'foo',
  bar: 'bar',
  0: 'foo',
  1: 'bar',
}

let { foo, bar } = data
let [ foo, bar ] = data // ERROR!
```

当我们来解构数组的时候会抛如下错误：

```sh
Uncaught TypeError: data is not iterable
```

所以，要想让对象具有数组的特性，必须得让对象具有 iterable 特性，也就是可迭代性。

在 ES6 中提供了 Symbol.iterable 可以设置一个对象具有可迭代性，

```sh
const data = {
  foo: 'foo',
  bar: 'bar',
  *[Symbol.iterator]() {
    yield 'foo'
    yield 'bar'
  },
}

let { foo, bar } = data
let [ foo, bar ] = data
```

这个似乎看起来没啥问题，但是当我们对 data 进行解构时，发现是这样的：

```sh
let { foo, ...rest } = data

// rest
{
  bar: 'bar',
  Symbol(Symbol.iterator): ƒ*
}
```

rest 中会包含 Symbol.iterator 额外属性。JS 中能被 … 解构出来的属性必须是可枚举(enumerable)的，那只要我们将 Symbol.iterator 的 enumerable 设置为 false 就会让其不出现在 rest 中。我们可以使用 Object.difineProperty 来设置。

```sh
const data = {
  foo: 'foo',
  bar: 'bar',
}

Object.defineProperty(data, Symbol.iterator, {
  enumerable: false,
  value: function*() {
    yield 'foo'
    yield 'bar'
  },
})
```

现在就可以将其他额外的属性给隐藏了

```sh
let { foo, ...rest } = data

// rest
{
  bar: 'bar'
}
```

在对数组进行解构时会去执行 Symbol.iterable() 这个函数，该函数返回一个 next 函数。这里我们借助 Generator 的特性，他会返回 next 方法，next 方法又返回值 value 和状态 done。

## 不使用 Generator

```sh
Object.defineProperty(obj, Symbol.iterator, {
  enumerable: false,
  value() {
    let index = 0
    let arr = [foo, bar]
    return {
      next: () => ({
        value: arr[index++],
        done: index > arr.length,
      })
    }
  }
})
```

最终完整的代码示例：

```sh
function createIsomorphicDestructurable(obj, arr) {
  
  const clone = { ...obj }
  
  Object.defineProperty(clone, Symbol.iterator, {
    enumerable: false,
    value() {
      let index = 0
      return {
        next: () => ({
          value: arr[index++],
          done: index > arr.length,
        })
      }
    }
  })

   return clone

```

使用

```sh
const foo = { name: 'foo' }
const bar = 1024

const obj = createIsomorphicDestructurable(
  { foo, bar },
  [ foo, bar ]
)

let { foo: foo1, bar: bar1 } = obj
// foo1 的值为: { name: 'foo'}， bar1 的值为：1024

let [ foo2, bar2 ] = obj 
// foo2 的值为: { name: 'foo'}， bar2 的值为：1024
```