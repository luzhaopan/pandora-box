
# reduce 

接收两个参数：

1. 第一个参数是在每一项上调用的函数
   
该函数接收 4 个参数：
前一个值 prev
当前值 cur
项的索引 index
数组对象 array

2. 第二个可选参数是作为归并基础的初始值

reduce 方法返回一个最终的值。

```sh
arr.reduce(function(prev, cur, index, arr){}, initialValue)
```

## 中心思想

reduce() 是归并方法

归并不是对每一项都执行目标函数，而是可以概括为如下两步：

1. 不断地对数组的前两项“取出”，对其执行目标函数，计算得到的返回值
2. 把上述返回值“填回”数组首部，作为新的 array[0]
3. 持续循环执行这个过程，直到数组中每一项都访问了一次
4. 返回最终结果


举例说明
对数组 [1，2，3] 归并执行 (prev, cur) => prev + cur，流程如图：

```sh
[1, 2, 3] // 取出 1 + 2 ，填回 3
[3, 3] // 取出 3 + 3 ，填回 6
[6] // 最终结果为 6
```

## 实现

```sh
// 第三版
Array.prototype.fakeReduce = function fakeReduce(fn, base) {
  if (typeof fn !== "function") {
    throw new TypeError("arguments[0] is not a function");
  }
  let initialArr = this;
  let arr = initialArr.concat(); // 得到副本,避免修改原数组

  if (base) arr.unshift(base); // 当存在归并基础值的参数时，将其从数组首部推入
  let index, newValue;

  while (arr.length > 1) {
    index = initialArr.length - arr.length + 1;
    newValue = fn.call(null, arr[0], arr[1], index, initialArr);

    arr.splice(0, 2, newValue); // 直接用 splice 实现删除前两项并替换
  }

  return newValue;
}
```

## 递归实现

```sh
const reduceHelper = (f, acc, arr) => {
  if (arr.length === 0) return acc
  const [head, ...tail] = arr
  return reduceHelper(f, f(acc, head), tail)
}

Array.prototype.fakeReduce = function (fn, initialValue) {
  const array = this
  return reduceHelper(fn, initialValue, array)
}
```