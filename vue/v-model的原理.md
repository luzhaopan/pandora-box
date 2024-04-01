# 一、v-model原理
1. 原理：

v-model本质上是一个语法糖。例如应用在输入框上，就是value属性 和 input事件 的合写

```sh
<template>
  <div id="app" >
    <input v-model="msg" type="text"> 

    //模板编译器会对v-model进行更冗长的等价展开
    <input :value="msg" @input="msg = $event.target.value" type="text">
  </div>
</template>
```

2. 作用：

提供数据的双向绑定

数据变，视图跟着变 :value

视图变，数据跟着变 @input

3. 注意

$event 用于在模板中，获取事件的形参

4. v-model使用在其他表单元素上的原理

不同的表单元素， v-model在底层的处理机制是不一样的。比如给checkbox使用v-model

底层处理的是 checked属性和change事件。


# 二、v-model简化代码

1. 目标：
父组件通过v-model 简化代码，实现子组件和父组件数据 双向绑定

2. 如何简化：

v-model其实就是 :value和@input事件的简写

- 子组件：props通过value接收数据，事件触发 input

- 父组件：v-model直接绑定数据

3. 代码示例
子组件

```sh
<select :value="value" @change="handleChange">...</select>
props: {
  value: String
},
methods: {
  handleChange (e) {
    this.$emit('input', e.target.value)
  }
}
```

父组件

```sh
  <select v-model="value">...</select>
```

# 三、v-model是双向绑定，是单向数据流

单向数据流：父组件可以向子组件传递数据，并且改变子组件的值，而子组件不能改变父组件传递给它的prop属性，官方推荐的做法是它抛出事件，通知父组件自行改变绑定的值。

单向数据流总结：数据向下，事件向上

# 四、vue3与vue2关于v-model的区别

1. vue3默认prop、event为：modelValue和update:modelValue
vue2默认prop、event为：value和input

2. vue3直接通过v-model后面参数v-model:msg来指定属性名，并且支持绑定多个v-model
vue2通过子组件的model属性中的prop值和event值来指定属性名和事件名。