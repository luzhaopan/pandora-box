[vuex和pinia区别](https://www.51cto.com/article/714675.html)

# vuex

## 5大核心概念

- state 全局共享属性 
- getters 针对于states数据进行二次计算
- mutations 存放同步方法
- actions 存放异步方法，并且是来提交mutations 
- modules 模块划分


## mutations和actions区别
1. 同步与异步：
- Mutations是同步的，这意味着在mutation中的函数执行时，不能包含任何异步操作，如Promise或者setTimeout等。这样可以保证状态变更的追踪和调试相对简单直观。
- Actions可以包含异步操作，它通过分发（dispatch）来触发，并且最终会提交（commit）一个mutation来变更状态。这使得actions成为处理例如API调用等需要等待响应的操作的理想选择。

2. 直接修改state的方式：
- Mutations可以直接修改state，但必须通过提交mutation的方式来进行，通常在组件中通过this.$store.commit('mutationName', payload)来调用。
- Actions无法直接修改state，它们的主要职责是执行异步操作，然后通过提交mutation来更改状态。在组件中，actions通过this.$store.dispatch('actionName', payload)来触发。

3. 使用场景：
- Mutations适合于简单的状态变更，比如根据用户输入更新应用的状态。
- Actions适用于复杂的状态变更，特别是那些涉及到异步操作的情况，如数据获取、提交表单等。

综上所述，mutations和actions都是用来改变Vuex store的状态，但它们在同步与异步、直接修改state的方式以及使用场景上有所不同。理解这些区别有助于更好地组织和维护Vuex store，以及提高应用的性能和可维护性

```sh
import { createStore } from 'vuex'
export default createStore({
   //全局state，类似于vue种的data
   state() {
     return {
       vuexmsg: "hello vuex",
       name: "xiaolll",
     };
   },
   //修改state函数
   mutations: {
   },
   //提交的mutation可以包含任意异步操作
   actions: {
   },
   //类似于vue中的计算属性
   getters: {
   },
   //将store分割成模块（module）,应用较大时使用
   modules: {
   }
})
```

# pinia

## 3大核心概念

- state 共享属性 
- getters 针对于states数据进行二次计算
- actions 存放同步、异步方法，并且是来提交mutations 

```sh
import { defineStore } from "pinia";
export const storeA = defineStore("storeA", {
 state: () => {
   return {
     piniaMsg: "hello pinia",
   };
 },
 getters: {},
 actions: {},
});
```

使用

```sh
<template>
  <div>{{ storeA.piniaMsg }}</div>
</template>
<script setup>
import { useStoreA } from "@/stores/storeA";
const storeA = useStoreA();
</script>
```

# 主要区别

1. Vuex的核心概念有state,getters,mutations,actions,moudles五个部分，Pinia的核心概念有state,getter,action三个部分

-  mutation 已被弃用。它们经常被认为是极其冗余的
- pinia不再有嵌套结构的moudles，它的每个store便是一个模块，如storeA，storeB... 。

2. Vuex对state的修改推荐使用mutations中的方法进行修改，因为Vuex需要追踪数据的变化，这使我们写起来比较繁琐，pinia则不再需要mutations，同步异步都可在actions进行操作。

3. Pinia中 getter，action 也可通过 this 访问整个 store 实例

4. 完整的 TypeScript 支持：与在 Vuex 中添加 TypeScript 相比，添加 TypeScript 更容易
   
5. 
   