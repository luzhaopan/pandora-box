# 类型别名 type
类型别名用来给一个类型起个新名字，使用 type 创建类型别名，类型别名不仅可以用来表示基本类型，还可以用来表示对象类型、联合类型、元组和交集。

# 接口 interface
接口是命名数据结构（例如对象）的另一种方式；与type 不同，interface仅限于描述对象类型。

# type 和 interface 异同

## 相似之处

1. 类型别名和接口都可以用来描述对象或函数

```sh
type Point = {
  x: number;
  y: number;
};
type SetPoint = (x: number, y: number) => void;
```

```sh
interface Point {
  x: number;
  y: number;
}
 
interface SetPoint {
  (x: number, y: number): void;
}
```
2. 都支持扩展（继承）
   
类型别名通过 &（交叉运算符）来扩展，而接口通过 extends 的方式来扩展

### type
```sh
type Animal = {
  name: string
}

type Bear = Animal & { 
  honey: boolean 
}

const bear: Bear = getBear() 
bear.name
bear.honey
```

### interface 
```sh
interface Animal {
  name: string
}

interface Bear extends Animal {
  honey: boolean
}
```

### interface 继承 type
```sh
type Animal = {
  name: string
}

interface Bear extends Animal {
  honey: boolean
}
```

### type 继承 interface
```sh
interface Animal {
  name: string
}

type Bear = Animal & { 
  honey: boolean 
}
```

3. 实现 implements

类可以实现interface 以及 type(除联合类型外)

```sh
interface ICat{
    setName(name:string): void;
}
 
class Cat implements ICat{
    setName(name:string):void{
        // todo
    }
}
 
// type 
type ICat = {
    setName(name:string): void;
}
 
class Cat implements ICat{
    setName(name:string):void{
        // todo
    }
}
```
上面提到了特殊情况，类无法实现联合类型, 是什么意思呢？

```sh
type Person = { name: string; } | { setName(name:string): void };
 
// 无法对联合类型Person进行实现
// error: A class can only implement an object type or intersection of object types with statically known members.
class Student implements Person {
  name= "张三";
  setName(name:string):void{
        // todo
    }
}
```

## 不同之处

1. 类型别名type可以为基本类型、联合类型或元组类型定义别名，而接口interface不行

```sh
type MyNumber = number;
type StringOrNumber = string | number;
type Point = [number, number];
```

2. 同名接口会自动合并，而类型别名不会

### interface  同名接口合并
```sh
interface User {
  name: string;
}

interface User {
  id: number;
}

let user: User = { id: 666, name: "阿宝哥" };
user.id; // 666
user.name; // "阿宝哥"
```

### type  同名类型别名会冲突
```sh
type User = {
  name: string;
};

// 标识符“User”重复。ts(2300)
type User = { //Error
  id: number;
};
```

# 使用场景

1. 使用类型别名的场景：

定义基本类型的别名时，使用 type；

定义元组类型时，使用 type；

定义函数类型时，使用 type；

定义联合类型时，使用 type；

定义映射类型时，使用 type；


2. 使用接口的场景：

需要利用接口自动合并特性的时候，使用 interface;

定义对象类型且无需使用 type 的时候，使用 interface;

编写三方库时使用interface，其更加灵活自动的类型合并可应对未知的复杂使用场景。
