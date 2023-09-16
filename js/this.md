# this 指向

在非箭头函数下， this 指向调用其所在函数的对象，而且是离谁近就是指向谁（此对于常规对象，原型链， getter & setter等都适用）；构造函数下，this与被创建的新对象绑定；DOM事件，this指向触发事件的元素；内联事件分两种情况，bind绑定， call & apply 方法等， 容以下一步一步讨论。箭头函数也会穿插其中进行讨论。

# 1. 全局环境下

```sh
console.log(this.document === document); // true

// 在浏览器中，全局对象为 window 对象：
console.log(this === window); // true

this.a = 37;
console.log(window.a); // 37
```

# 2. 函数上下文调用

## (1) 函数直接调用

普通函数内部的this分两种情况，严格模式和非严格模式。

非严格模式下，this 默认指向全局对象window

```sh
function f1(){
  return this;
}

f1() === window; // true
```

而严格模式下， this为undefined

```sh
function f2(){
  "use strict"; // 这里是严格模式
  return this;
}

f2() === undefined; // true
```

## (2) 对象中的this

对象内部方法的this指向调用这些方法的对象，

1) 函数的定义位置不影响其this指向，this指向只和调用函数的对象有关。
   
2) 多层嵌套的对象，内部方法的this指向离被调用函数最近的对象（window也是对象，其内部对象调用方法的this指向内部对象， 而非window）。

```sh
//1
var o = {
  prop: 37,
  f: function() {
    return this.prop;
  }
};
console.log(o.f());  //37
var a = o.f;
console.log(a()):  // 指向window，没有属性，所以undefined

var o = {prop: 37};

function independent() {
  return this.prop;
}

o.f = independent;

console.log(o.f()); // logs 37

//2
o.b = {
  g: independent,
  prop: 42
};
console.log(o.b.g()); // logs 42
```

## （3）原型链中this

原型链中的方法的this仍然指向调用它的对象，与以上讨论一致；看个例子，

```sh
var o = {
  f : function(){ 
    return this.a + this.b; 
  }
};
var p = Object.create(o);
p.a = 1;
p.b = 4;

console.log(p.f()); // 5
```

可以看出， 在p中没有属性f，当执行p.f()时，会查找p的原型链，找到 f 函数并执行，但这与函数内部this指向对象 p 没有任何关系，只需记住谁调用指向谁。

以上对于函数作为getter & setter 调用时同样适用。


## (4) 构造函数中this

构造函数中的this与被创建的新对象绑定。

注意：当构造器返回的默认值是一个this引用的对象时，可以手动设置返回其他的对象，如果返回值不是一个对象，返回this。

```sh
function C(){
  this.a = 37;
}

var o = new C();
console.log(o.a); // logs 37


function C2(){
  this.a = 37;
  return {a:38};
}

var b = new C2();
console.log(b.a); // logs 38
```

以上两个例子内部的this都指向对象o, 看到这里的你不妨在控制台执行下以上代码，看看对象 o 和 b ，这些是属于构造函数的内容了，此处不多做介绍。（C2函数中的this.a = 37 对整个过程完全没有影响的， 可以被忽略的）。


## （5）call & apply

当函数通过Function对象的原型中继承的方法 call() 和 apply() 方法调用时， 其函数内部的this值可绑定到 call() & apply() 方法指定的第一个对象上， 如果第一个参数不是对象，JavaScript内部会尝试将其转换成对象然后指向它。

```sh
function add(c, d){
  return this.a + this.b + c + d;
}

var o = {a:1, b:3};

add.call(o, 5, 7); // 1 + 3 + 5 + 7 = 16

add.apply(o, [10, 20]); // 1 + 3 + 10 + 20 = 34

function tt() {
  console.log(this);
}
// 返回对象见下图（图1）
tt.call(5);  // Number {[[PrimitiveValue]]: 5} 
tt.call('asd'); // String {0: "a", 1: "s", 2: "d", length: 3, [[PrimitiveValue]]: "asd"}
```
![](./img/2023-08-29-11-57-07.png)

## (6) bind 方法

bind方法在ES5引入， 在Function的原型链上， Function.prototype.bind。通过bind方法绑定后， 函数将被永远绑定在其第一个参数对象上， 而无论其在什么情况下被调用。

```sh
function f(){
  return this.a;
}

var g = f.bind({a:"azerty"});
console.log(g()); // azerty

var o = {a:37, f:f, g:g};
console.log(o.f(), o.g()); // 37, azerty
```

# 3 DOM 事件处理函数中的 this & 内联事件中的 this

## (1) DOM事件处理函数

当函数被当做监听事件处理函数时， 其 this 指向触发该事件的元素 （针对于addEventListener事件）

```sh
  // 被调用时，将关联的元素变成蓝色
	function bluify(e){
	  //在控制台打印出所点击元素
	  console.log(this);
	  //阻止时间冒泡
	  e.stopPropagation();
	  //阻止元素的默认事件
	  e.preventDefault();      
	  this.style.backgroundColor = '#A5D9F3';
	}

	// 获取文档中的所有元素的列表
	var elements = document.getElementsByTagName('*');

	// 将bluify作为元素的点击监听函数，当元素被点击时，就会变成蓝色
	for(var i=0 ; i<elements.length ; i++){
	  elements[i].addEventListener('click', bluify, false);
	}

```

## (2) 内联事件

内联事件中的this指向分两种情况：

1) 当代码被内联处理函数调用时，它的this指向监听器所在的DOM元素
2) 当代码被包括在函数内部执行时，其this指向等同于 函数直接调用的情况，即在非严格模式指向全局对象window， 在严格模式指向undefined
![](./img/2023-08-29-12-03-35.png)

![](./img/2023-08-29-12-04-14.png)

## (3) setTimeout & setInterval

对于延时函数内部的回调函数的this指向全局对象window（当然我们可以通过bind方法改变其内部函数的this指向）
看下边代码及截图

```sh
//默认情况下代码
function Person() {  
    this.age = 0;  
    setTimeout(function() {
        console.log(this);
    }, 3000);
}

var p = new Person();//3秒后返回 window 对象
==============================================
//通过bind绑定
function Person() {  
    this.age = 0;  
    setTimeout((function() {
        console.log(this);
    }).bind(this), 3000);
}

var p = new Person();//3秒后返回构造函数新生成的对象 Person{...}
```

![](./img/2023-08-29-12-05-27.png)

# 3 箭头函数中的 this

由于箭头函数不绑定this， 它会捕获其所在（即定义的位置）上下文的this值， 作为自己的this值，

1) 所以 call() / apply() / bind() 方法对于箭头函数来说只是传入参数，对它的 this 毫无影响。
2) 考虑到 this 是词法层面上的，严格模式中与 this 相关的规则都将被忽略。（可以忽略是否在严格模式下的影响）

因为箭头函数可以捕获其所在上下文的this值 所以

```sh
function Person() {  
    this.age = 0;  
    setInterval(() => {
        // 回调里面的 `this` 变量就指向了期望的那个对象了
        this.age++;
    }, 3000);
}

var p = new Person();
```

以上代码可以得到我们所以希望的值，下图可以看到，在setTimeout中的this指向了构造函数新生成的对象，而普通函数指向了全局window对象

![](./img/2023-08-29-12-08-40.png)

```sh
var adder = {
  base : 1,
    
  add : function(a) {
    var f = v => v + this.base;
    return f(a);
  },

  addThruCall: function inFun(a) {
    var f = v => v + this.base;
    var b = {
      base : 2
    };
            
    return f.call(b, a);
  }
};

console.log(adder.add(1));         // 输出 2
console.log(adder.addThruCall(1)); // 仍然输出 2（而不是3，其内部的this并没有因为call() 而改变，其this值仍然为函数inFun的this值，指向对象adder
```

对于是否严格模式示例代码（可以复制进控制台进行验证）

```sh
var f = () => {'use strict'; return this};
var p = () => { return this};
console.log(1,f() === window);
console.log(2,f() === p());
//1 true
//2 true
```
![](./img/2023-08-29-12-11-23.png)

以上的箭头函数都是在方法内部，总之都是以非方法的方式使用，如果将箭头函数当做一个方法使用会怎样呢？
上例子

```sh
var obj = {
  i: 10,
  b: () => console.log(this.i, this),
  c: function() {
    console.log( this.i, this)
  }
}
obj.b();  // undefined window{...}
obj.c();  // 10 Object {...}
```

![](./img/2023-08-29-12-14-00.png)

```sh
let p = {
  a: function () {
    var obj = {
      i: 10,
      b: () => {console.log(this.i, this)},
      c: function () {
        console.log(this.i, this)
      }
    }
    obj.b()
  }
}
p.a()
```

运行以上代码，看到 this 为 p，并不是之前的结论指向window，而是指向了当前被定义变量的上下文环境

简而言之，作为方法的箭头函数this的指向是当前的上下文。

