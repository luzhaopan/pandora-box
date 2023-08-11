# typescript

# 基础类型

1. 布尔值
```sh
let isDone: boolean = false;
```

2. 数字

和JavaScript一样，TypeScript里的所有数字都是浮点数。 这些浮点数的类型是number。 除了支持十进制和十六进制字面量，TypeScript还支持ECMAScript 2015中引入的二进制和八进制字面量。

```sh
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
```

3. 字符串

```sh
let name: string = "bob";
name = "smith";

// 模板字符串
let name: string = `Gene`;
let age: number = 37;
let sentence: string = `Hello, my name is ${ name }.
I'll be ${ age + 1 } years old next month.`;
```

4. 数组

```sh
// 可以在元素类型后面接上[]，表示由此类型元素组成的一个数组：
let list: number[] = [1, 2, 3];

// 使用数组泛型，Array<元素类型>
let list: Array<number> = [1, 2, 3];
```

5. 元组Tuple

元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。以下定义的表示一个包含string和number的元组。

```sh
// Declare a tuple type
let x: [string, number];

// Initialize it
x = ['hello', 10]; // OK

// Initialize it incorrectly
x = [10, 'hello']; // Error
```

6. 任意值

不确定为什么类型的值的时候，可以用any来指定其为任意值，如下
```sh
let lt: any = 1122,
it = '0410' // 可以在将其变成字符串类型

let lzp: any[]=[1,'lt', true] // 包含多种类型的数组
```

7. 空值

当没有返回值的时候，设置为void，作用和any 相反，如下，设置一个没有返回值的函数

```sh
function lzp(): void {}
```

8. null  和 undefined

TypeScript里，undefined和null两者各自有自己的类型分别叫做 undefined 和 null。 和 void 相似，它们的本身的类型用处不是很大：

```sh
let u: undefined = undefined;
let n: null = null;
```

默认情况下null和undefined是所有类型的子类型。 就是说你可以把null和undefined赋值给number类型的变量。
然而，当你指定了--strictNullChecks标记，null和undefined只能赋值给void和它们各自。

```sh
// 这样不会报错
let num: number = undefined;

// 这样也不会报错
let u: undefined;
let num: number = u;
```

9. Never

该类型表示那些永不存在的值的类型

10. 类型断言

已经清楚确切的类型，有两种形式
类型断言有两种形式。 其一是“尖括号”语法：

```sh
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

// 另一个为as语法：
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length；
// jsx语法只支持第二种
```

# 变量声明

1.  
var声明变量的时候，在获取到变量之后，它的行为是，每次进入一个作用域的时候，它创建一个变量环境，就算作用域内代码已经执行完毕，这个环境与其捕获的变量依然存在。

```sh
for(var i = 0; i < 10; i++){
    (function(i){
        setTimeout(function() {
            console.log(i)
        }, 100 * i)
    })(i)
}
```
看一下这个例子，它可以正常输出我们想要的结果，原因是使用立即执行函数表达式来获取每次for循环迭代里的状态。实际上做的是为获取到变量创建一个新的变量环境。

```sh
for(let i = 0; i < 10; i++){
    setTimeout(function(){
        console.log(i)
    }, 100 * i)
}
```
let声明不仅是在循环里引入一个新的变量环境，而且每次迭代都会创建一个这样的新的作用域。这个作用等同于立即执行表达式。
现在我们有两种作用域相似的声明方式，我们自然会问到底应该使用哪个。答案就是：依情况而定。

使用最小特权原则，所有变量除了你计划去修改的都应该使用const。基本原则就是如果一个变量不需要对它写入，那么其他使用这些代码的人也不能够写入它们，并且要思考为什么会需要对这些变量重新赋值。使用 const 也可以让我们更容易的推测数据的流动。

另一方面，用户很喜欢 let 的简洁性。

2.  ... 用于对象或数组
   
它允许将一个数组展开成另一个数组或将一个对象展开成另一个对象。

```sh
let first = [1, 2]
let second = [3, 4]
let both = [0, ...first, ...second, 5]

// both [0, 1, 2, 3, 4, 5]
```


注意：对象的展开仅包含自身的可枚举属性，当展开一个对象实例时它会丢失它的方法

# 接口（interface）

作用：为需要的类型进行命名和自己的代码或第三方代码制定契约。

1. 可选属性

可选属性，需要在 可选属性名字定义的后面加一个？符号。
好处：
1）可以对可能存在的属性进行预定义；
2）可以捕获引用了不存在的属性时的错误。

2. 只读属性
3. 
在属性名前通过 readonly 来指定

```sh
interface Point {
    readonly x: number;
    readonly y: number;
}
```

通过赋值一个对象字面量来构造一个point，赋值后x和y再也不能改变。

```sh
let p1: Point = { x: 10, y: 20 };
p1.x = 5; // error! 报错，不能再重新赋值
```

TypeScript具有ReadonlyArray<T>类型，与Array<T>相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改：
```sh
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!
```

上面代码的最后一行，可以看到就算把整个ReadonlyArray赋值到一个普通数组也是不可以的。 但是你可以用类型断言重写：
```sh
a = ro as number[];
```
最简单判断该用readonly还是const的方法是看要把它做为变量使用还是做为一个属性。 做为变量使用的话用const，若做为属性则使用readonly。

3. 额外属性检查

当使用不存在于定义的接口中的属性的时候，会进行额外的属性检查

```sh
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    // ...
}

// error: 'colour' not expected in type 'SquareConfig'
let mySquare = createSquare({ colour: "red", width: 100 });
```

解决办法：
1）使用类型断言
```sh
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
```

2）添加一个字符串索引签名
```sh
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}
```

4. 函数类型

为了使用接口表示函数类型，我们需要给接口定义一个调用签名。 它就像是一个只有参数列表和返回值类型的函数定义。参数列表里的每个参数都需要名字和类型。

```sh
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
  let result = source.search(subString);
  return result > -1;
}
```

对于函数类型的类型检查来说，函数的参数名不需要与接口里定义的名字相匹配。 比如，我们使用下面的代码重写上面的例子：

```sh
let mySearch: SearchFunc;
mySearch = function(src: string, sub: string): boolean {
  let result = src.search(sub);
  return result > -1;
}
```

5. 可索引类型

1）与使用接口描述函数类型差不多，我们也可以描述那些能够“通过索引得到”的类型，比如a[10]或ageMap["daniel"]。 可索引类型具有一个索引签名，它描述了对象索引的类型，还有相应的索引返回值类型

```sh
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```

上面例子里，我们定义了StringArray接口，它具有索引签名。 这个索引签名表示了当用number去索引StringArray时会得到string类型的返回值。


2）共有支持两种索引签名：字符串和数字。 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型

这是因为当使用number来索引时，JavaScript会将它转换成string然后再去索引对象。 也就是说用100（一个number）去索引等同于使用"100"（一个string）去索引，因此两者需要保持一致。

```sh
class Animal {
    name: string;
}
class Dog extends Animal {
    breed: string;
}

// 错误：使用'string'索引，有时会得到Animal!
interface NotOkay {
    [x: number]: Animal;
    [x: string]: Dog;
}
```

6. 类类型

1）实现接口

typescript可以用接口来明确的强制一个类去符合某种契约。
```sh
interface ClockInterface {
    currentTime: Date;
}

class Clock implements ClockInterface {
    currentTime: Date;
    constructor(h: number, m: number) { }
}
```

2）接口继承
接口和类一样可以继承，可以灵活的从一个接口复制成员到另一个接口，实现可重用。
```sh
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
```
继承多个接口
```sh
interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Square extends Shape, PenStroke {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

# 类

# 函数

1. 可选参数和默认参数

传给一个函数的参数个数必须与函数期望的参数个数一致
```sh
function buildName(firstName: string, lastName: string) {
    return firstName + " " + lastName;
}

let result1 = buildName("Bob");                  // error, too few parameters
let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");         // ah, just right
```

# 泛型

1. 定义泛型
```sh
function identity<T>(arg: T): T {
    return arg;
}
```

我们给identity添加了类型变量T。 T帮助我们捕获用户传入的类型（比如：number），之后我们就可以使用这个类型。 之后我们再次使用了T当做返回值类型。现在我们可以知道参数类型与返回值类型是相同的了。 
```sh
let output = identity<string>("myString");  // type of output will be 'string'
```