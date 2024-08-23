# toRef / toRefs

创建一个ref对象，其value值指向另一个对象中的某个属性。

语法：const name = toRef（person,‘name’）。

应用：要将响应式对象中的某个属性单独提供给外部使用时。

扩展：toRefs与toRef功能一致，但可以批量创建多个ref对象，语法：toRefs(person)。

## 作用

toRef 和 toRefs 可以用来复制 reactive 里面的属性然后转成 ref，而且它既保留了响应式，也保留了引用，也就是你从 reactive 复制过来的属性进行修改后，除了视图会更新，原有 reactive 里面对应的值也会跟着更新，如果你知道 浅拷贝 的话那么这个引用就很好理解了，它复制的其实就是引用 + 响应式 ref

不加 s 和 加 s 的区别就是这样：

1. toRef: 复制 reactive 里的单个属性并转成 ref

2. toRefs: 复制 reactive 里的所有属性并转成 ref

## 使用方式

1. toRef

```javascript
<template>
  <h2>
    reactive-greet: {{ info.greet }} 
  </h2>
  <h2>
    toRef-greet: {{ rGreet }}
  </h2>
  <button @click="onChangeGreet">更换问候语</button>
</template>

<script>
import { reactive, toRef } from 'vue'
export default {
	setup() {
    let info = reactive({
      name: 'Tony',
      greet: 'Hello'
    })
	// 复制 info 里的 greet 属性
    let rGreet = toRef(info, 'greet')
    // 更改 rGreet
    const onChangeGreet = () => {
      rGreet.value = 'world!'
    }
    return {
      info,
      rGreet,
      onChangeGreet
    }
  }
}
</script>
```

2. toRefs
   
```javascript
<template>
  <h2>
    reactive-info-greet: {{ info.greet }} 
  </h2>
  // 要带上 .value
  <h2>
    toRefs-rInfo-greet: {{ rInfo.greet.value }}
  </h2>
  <button @click="onChangeGreet">更新</button>
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
	setup() {
    let info = reactive({
      name: 'Tony',
      greet: 'Hello'
    })
	// 复制整个 info
    let rInfo = toRefs(info)
    // 更改 rInfo.greet
    const onChangeGreet = () => {
      rInfo.greet.value = 'world!'
    }
    return {
      info,
      rInfo,
      onChangeGreet
    }
  }
}
</script>

```