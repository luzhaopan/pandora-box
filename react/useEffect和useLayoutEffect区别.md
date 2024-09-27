useEffect和useLayoutEffect区别


1. 执行时机不同：useEffect 是在组件渲染完成后异步执行，而 useLayoutEffect 则是在组件渲染完成后同步执行。

2. 对渲染的影响不同：useEffect 的执行不会阻塞浏览器的渲染工作，而 useLayoutEffect 的执行可能会阻塞浏览器的渲染工作，因此使用 useLayoutEffect 时需要注意性能问题。

useLayoutEffect 是在组件渲染完成后，但还未绘制到浏览器时同步执行的 Hook