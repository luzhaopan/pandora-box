1、vue 的双向绑定

其实现原理是对data的getter/setter方法进行拦截（Object.defineProperty或者Proxy），
利用发布订阅的设计模式，在getter方法中进行订阅，在setter方法中发布通知，让所有订阅者完成响应。

2、Object.defineProperty

Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。

// obj：要定义属性的对象。
// prop：要定义或修改的属性的名称。
// descriptor：要定义或修改的属性描述符。
Object.defineProperty(obj, prop, descriptor)

var user = {}
Object.defineProperty(user, 'name', {
  value: 'erikchan'
})

// get 和 set 劫持数据
Object.defineProperty(user, "name", {
    get: function(){
        console.log('get name')
        return initName
    },
    set: function(val){
        console.log('set name')
        initName = val
    }
});

1）Object.defineProperty只能劫持对象的属性，需要遍历对象的每一个属性，如果属性值也是对象，就需要递归进行深度遍历, 可以通过 Object.keys() 来实现对每个属性的劫持。
2）Object.defineProperty劫持的是对象的属性，所以新增属性时，需要重新遍历对象， 对其新增属性再次使用Object.defineProperty进行劫持。
也就是Vue2.x中给数组和对象新增属性时，需要使用$set才能保证新增的属性也是响应式的, $set内部也是通过调用Object.defineProperty去处理的。

缺陷：

无法检测到对象属性的添加或删除
无法检测数组元素的变化，需要进行数组方法的重写
无法检测数组的长度的修改

但是：
Object.defineProperty无法监听数组数据的变化，但是为什么数组在使用push pop等方法的时候可以触发页面更新呢，
那是因为vue内部拦截了这些方法。比如数组在使用push pop等方法的时候为什么可以触发页面更新呢，那是因为vue内部拦截了这些方法。

 // 重写push等方法，然后再把原型指回原方法
  var ARRAY_METHOD = [ 'push', 'pop', 'shift', 'unshift', 'reverse',  'sort', 'splice' ];
  var array_methods = Object.create(Array.prototype);
  ARRAY_METHOD.forEach(method => {
    array_methods[method] = function () {
      // 拦截方法
      return Array.prototype[method].apply(this, arguments);
    }
  });


3、proxy

Proxy 相对 defineProperty，不在局限某个属性，而是直接对整个对象进行代理.
Proxy可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，
都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写

var proxy = new Proxy(target, handler);

var target = {}

var proxyObj = new Proxy(
    target,
    {
        get: function (target, propKey, receiver) {
            console.log(`getting ${propKey}!`);
            return Reflect.get(target, propKey, receiver);
        },
        set: function (target, propKey, value, receiver) {
            console.log(`setting ${propKey}!`);
            return Reflect.set(target, propKey, value, receiver);
        },
        deleteProperty: function (target, propKey) {
            console.log(`delete ${propKey}!`);
            delete target[propKey];
            return true;
        }
    }
);


可以看到Proxy直接代理了target整个对象，并且返回了一个新的对象，通过监听代理对象上属性的变化来获取目标对象属性的变化, 
并且 deleteProperty 还能监听属性的删除。

缺点：
Proxy的缺点也很明显，作为新的内置对象，对老浏览器的兼容性就不那么友好了，所以在使用的时候得考虑这方面的兼容问题