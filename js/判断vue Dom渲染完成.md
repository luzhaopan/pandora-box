# MutationObserver – 判断vue Dom渲染完成

1. 获取想要获取dom元素的宽高,打印出来的结果值一直小于DOM元素本身高度。查阅很多资料无果，
2. 初步判断是vue升级以后，this.$nextTick监听方式发生改变。 更改方案，选择MutationObserver

3. Mutation Observer 是在DOM4中定义的，用于替代 mutation events 的新API，它的不同于events的是，所有监听操作以及相应处理都是在其他脚本执行完成之后异步执行的，并且是所有变动触发之后，将变的记录在数组中，统一进行回调的，也就是说，当你使用observer监听多个DOM变化时，并且这若干个DOM发生了变化，那么observer会将变化记录到变化数组中，等待一起都结束了，然后一次性的从变化数组中执行其对应的回调函数。

# MutationObserver 作用
MutationObserver接口提供了监视对DOM树所做更改的能力。

1. 语法：var observer = new MutationObserver(callback);
2. 作用：DOM规范的MutationObserver()构造函数 - 是MutationObserver接口内容的一部分 - 创建并返回一个新的观察者，它在DOM事件触发时调用指定的回调函数。DOM的观察不会立即启动;而必须先调用observe() 方法来确定要监听哪一部分的DOM以及要注意哪些更改。
3. 参数：回调函数拥有两个参数：一个是描述所有被触发改动的MutationRecord对象数组，另一个是调用该函数的MutationObserver 对象。（每当被指定的节点或子树以及配置项有Dom变动时会被调用）
4. 返回值：一个新的、包含监听Dom变化回调函数的MutationObserver 对象