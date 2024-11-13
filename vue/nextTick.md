# 用nextTick()的原因：
JS执行是单线程的，它是基于事件循环的

1. 所有同步任务都在主线程上执行，形成一个执行栈。
2. 主线程之外，会存在一个任务队列，只要异步任务有了结果，就在任务队列中放置一个事件。
3. 当执行栈中的所有同步任务执行完后，就会读取任务队列。那些对应的异步任务，会结束等待状态，进入执行栈。
4. 主线程不断重复第三步。

# vue是异步更新

1. 由于Vue DOM更新是异步执行的，所以不是每次数据改变都会触发更新dom，而是将这些操作都缓存在一个队列，在一个事件循环结束之后，刷新队列，统一执行dom更新操作。
   
2. 只要监听数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更，在缓冲时会去除重复数据，从而避免不必要的计算和DOM操作。
   
3. 然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。
   
4. 等同一数据循环中的所有数据变化完成之后，再统一进行视图更新。
   
5. 为了确保得到更新后的DOM，所以设置了 Vue.nextTick()方法。

举例比如设置this.value = 'new value'的时候，Vue并没有马上去更新DOM数据，而是将这个操作放进一个队列中；
如果我们重复执行的话，队列还会进行去重操作；等待同一事件循环中的所有数据变化完成之后，会将队列中的事件拿出来处理。

这样做主要是为了提升性能，因为如果在主线程中更新DOM，循环100次就要更新100次DOM；但是如果等事件循环完成之后更新DOM，只需要更新1次。

# 什么是nextTick()

1. nextTick主要使用了宏任务和微任务
2. Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，
如果执行环境不支持，则会采用 setTimeout(fn, 0)代替。

通过源码发现外层定义了三个变量，有一个变量看名字就很熟悉：callbacks，就是我们上面说的队列；
在nextTick的外层定义变量就形成了一个闭包，所以我们每次调用$nextTick的过程其实就是在向callbacks新增回调函数的过程。

callbacks新增回调函数后又执行了timerFunc函数，pending用来标识同一个时间只能执行一次。
那么这个timerFunc函数是做什么用的呢，我们继续来看代码：


出现了好几个isNative函数，这是用来判断所传参数是否在当前环境原生就支持；
例如某些浏览器不支持Promise，虽然我们使用了垫片(polify)，但是isNative(Promise)还是会返回false。

可以看出这边代码其实是做了四个判断，对当前环境进行不断的降级处理，尝试使用原生的Promise.then、MutationObserver和setImmediate，
上述三个都不支持最后使用setTimeout；降级处理的目的都是将nextTickHandler函数放入微任务(判断1和判断2)或者宏任务(判断3和判断4)，
等待下一次事件循环时来执行。MutationObserver是Html5的一个新特性，用来监听目标DOM结构是否改变，也就是代码中新建的textNode；如果改变了就执行MutationObserver构造函数中的回调函数，不过是它是在微任务中执行的。

关键函数 nextTickHandler

nextTick不顾一切的要把它放入微任务或者宏任务中去执行，
它其实就是把callbacks数组复制一份，然后把callbacks置为空，最后把复制出来的数组中的每个函数依次执行一遍；所以它的作用仅仅是用来执行callbacks中的回调函数。


## vue2.5的降级策略
上面我们讲到了，队列控制的最佳选择是microtask，而microtask的最佳选择是microtask:  Promise , MutatioObserver

如果当前环境不支持Promise，MutatioObserver，vue就不得不降级为macrotask来做队列控制了。

macrotask：setImmediate、MessageChannel、setTimeout.

setImmediate是最理想的方案了，可惜的是只有IE和nodejs支持。

MessageChannel的onmessage回调也是microtask，但也是个新API，面临兼容性的尴尬...

所以最后的兜底方案就是setTimeout了，尽管它有执行延迟，可能造成多次渲染，算是没有办法的办法了。

# 源码
```sh
var nextTick=(function () {
    //存储需要触发的回调函数
    var callbacks=[];
    //是否正在等待的标志（false:允许触发在下次事件循环触发callbacks中的回调,
    // true: 已经触发过,需要等到下次事件循环）
    var pending=false;
    //设置在下次事件循环触发callbacks的触发函数
    var timerFunc;
    //处理callbacks的函数
    function nextTickHandler() {
        // 可以触发timeFunc
        pending=false;
        //复制callback
        var copies=callbacks.slice(0);
        //清除callback
        callbacks.length=0;
        for(var i=0;i<copies.length;i++){
            //触发callback的回调函数
            copies[i]();
        }
    }
    // 判断1：是否原生支持promise， 如果支持promise，使用promise实现
    if(typeof Promise !=='undefined' && isNative(promise)){
        var p=Promise.resolve();
        var logError=function (err) {
            console.error(err);
        };
        timerFunc=function () {
            p.then(nextTickHandler).catch(logError);
            //iOS的webview下，需要强制刷新队列，执行上面的回调函数
            if(isIOS) {setTimeout(noop);}
        };
        // 判断2：是否原生支持MutationObserver，
    //    如果Promise不支持，但支持MutationObserver
    //    H5新特性，异步,当dom变动是触发,注意是所有的dom都改变结束后触发
    } else if (typeof MutationObserver !=='undefined' && (
        isNative(MutationObserver) ||
        MutationObserver.toString()==='[object MutationObserverConstructor]')){
            var counter = 1;
            var observer=new MutationObserver(nextTickHandler);
            var textNode=document.createTextNode(String(counter));
            observer.observe(textNode,{
                characterData:true
            });
            timerFunc=function () {
                counter=(counter+1)%2;
                textNode.data=String(counter);
            };
    } else if(typeof setImmediate !=='undefined' && isNative(setImmediate)) {
        //判断3 是否原生支持setImmediate
        timerFunc=function () {
            setImmediate(nextTickHandler,0);
        };
    }  else {
        //判断4 上面都不支持，用setTimeout
        timerFunc=function () {
            setTimeout(nextTickHandler,0);
        };
    }
    //nextTick接收的函数，参数1：回调函数 参数2：回调函数的执行上下文
    return function queueNextTick(cb,ctx) {
        //用于接收触发Promise.then中回调的函数
        //向回调函数中pushcallback
        var _resolve;
        callbacks.push(function () {
            //如果有回调函数，执行回调函数
            if(cb) {cb.call(ctx);}
            //触发Promise的then回调
            if(_resolve) {_resolve(ctx);}
        });
        //是否执行刷新callback队列
        if(!pending){
            pending=true;
            timerFunc();
        }
        //如果没有传递回调函数，并且当前浏览器支持promise，使用promise实现
        if(!cb && typeof  Promise !=='undefined'){
            return new Promise(function (resolve) {
                _resolve=resolve;
            })
        }
    }
})
```