# 实现一个 new

## new的过程中发生了下面这些事：

1. 首先创建一个空的对象
2. 将构造函数作用域赋到创建的对象中(因此this将会指向这个新对象)
3. 执行构造函数中代码
4. 返回一个对象（如果构造函数本身有返回值且是对象类型，就返回本身的返回值，如果没有才返回新对象）

function _new(Constru,arguments){}

const person = _new(Person,arguments)

function _new(){
    // 1.创建一个空对象
    // var obj = {}; 和下面的是同样的效果
    var obj = new Object();


    // 2.传入的构造函数Constru与返回的对象obj需要具有实例与构造函数的关系
    // 获得这个构造函数
    // Constructor = [].shift.apply(arguments);
    Constructor = [].shift.call(arguments);
    // 将构造函数的原型对象，作为新对象的原型对象
    obj.__proto__ = Constructor.prototype;


    // 3.绑定this，让this指向新的对象
    // var ret = Constructor.apply(obj,arguments)
    // var ret = Constructor.call(obj,arguments[0],arguments[1],arguments[2])
    var ret = Constructor.call(obj,...arguments)


    // 4.确保 使用new返回的是一个 object 对像
    return typeof ret === "object" ? ret : obj;
}


## 注释
其实这可以理解为，让类数组调用数组的方法！
[].shift.call( arguments )
shift() 方法删除数组第一项，并返回删除项。
根据上边的理解，这句代码意思就是： “删除并拿到arguments的第一项”,  第一个参数一般是要指向的对象，比如this