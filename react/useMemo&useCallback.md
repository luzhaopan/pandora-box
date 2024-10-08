# 前端工程师在项目中也是经常会使用到useMemo，useCallBack的，这是两个优化性能的方法，
# 那么useMemo，useCallBack到底是什么呢？什么时候用呢？

# 1.useMemo
useMemo：会在组件首次加载和重渲染期间执行，执行的函数需要和渲染相关的。
使用示例如下：
```sh
import React, {useMemo, useState} from "react";
function Memo (){
    const [count, setCount] = useState(0)
    const [bool, setBool] = useState(true)
    useMemo(() => {
        console.log('useMemo')
    }, [count])


    return (
        <div>
            <div>{count}</div>
            <div>{bool ? '正面' : '反面'}</div>
            <button onClick={() => setCount(count + 1)}>+1哟！</button>
            <button onClick={() => setBool(!bool)}>点击取反操作</button>
        </div>
    )
}
export default Memo;
```
 
详细解释：useMemo 类似于Vue的计算属性computed，监听某个值的变化，根据变化的值重新计算新值；

通过点击触发改变count的值，组件会重新渲染且useMemo会监听count值的变化进行重新计算，

但是当我触发改变bool的值，组件只进行了重新渲染但是useMemo没有重新计算并执行，

因为当前useMomo监听的是count的变化，其他变化则不会去管；
 
# 2.useCallback

useCallback：会在渲染期间执行，返回一个函数，useCallback是用来帮忙缓存函数的，

当依赖项没有发生变化时，返回缓存的指针，当在依赖项变化的时候会更新，返回一个新的函数

使用示例：

```sh
import React, { useState, useCallback } from 'react';
export default function App() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  
  const handleClickButton1 = () => {setCount1(count1 + 1)};
  
  const handleClickButton2 = useCallback(() => {
    console.log('useCallback')
    setCount2(count2 + 1);
  }, [count2]);
  
  return (
    <div>
      <div>
        <Button onClick={handleClickButton1}>点击Button1</Button>
      </div>
      <div>
        <Button onClick={handleClickButton2}>点击Button2</Button>
      </div>
    </div>
  );
}
```


详细讲解：经过useCallback优化后，当Button2 是点击触发自身时才会更新，

Button1只要父组件更新后就会变更。
 
# 3.总结

- ‌useCallback‌主要用于性能优化中函数的memoization（记忆化）。它返回一个memoized（记忆化）版本的回调函数，只有在其依赖项变化时才会更新。这是因为组件的重新渲染可能会导致回调函数的重新定义，从而导致子组件进行不必要的重渲染。使用useCallback可以避免这种情况，当回调函数作为props传递给子组件时，如果依赖项没有变化，可以避免函数的重新创建，从而减少不必要的渲染。‌

- ‌useMemo‌主要用于性能优化中数据的memoization（记忆化）。它返回一个memoized（记忆化）版本的计算值，只有在其依赖项变化时才会更新。在某些情况下，进行一些计算比较耗时，但计算结果在多次渲染过程中保持不变，这时使用useMemo可以有效地优化性能，减少重复计算。‌

简而言之，useCallback用于缓存函数以避免不必要的组件渲染，而useMemo用于缓存计算结果以减少重复的计算开销

- 相同点：
useCallback 和 useMemo 都是性能优化的手段，类似于类组件中的 shouldComponentUpdate，

在子组件中使用 shouldComponentUpdate， 判定该组件的 props 和 state 是否有变化，

从而避免每次父组件render时都去重新渲染子组件。
 
- 不同点：
useCallback 和 useMemo 的区别是useCallback返回一个函数，

当把它返回的这个函数作为子组件使用时，可以避免每次父组件更新时都重新渲染这个子组件。
