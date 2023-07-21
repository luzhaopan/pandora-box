# watch和watchEffect

![](2023-07-21-11-07-59.png)

watch 和 watchEffect 的主要功能是相同的，都能响应式地执行回调函数。它们的区别是追踪响应式依赖的方式不同：

1. watch 只追踪明确定义的数据源，不会追踪在回调中访问到的东西；默认情况下，只有在数据源发生改变时才会触发回调；watch 可以访问侦听数据的新值和旧值。
2. 有惰性：运行的时候，不会立即执行；
3. 可配置：配置项可补充 watch 特点上的不足：
immediate：配置 watch 属性是否立即执行，值为 true 时，一旦运行就会立即执行，值为 false 时，保持惰性。
deep：配置 watch 是否深度监听，值为 true 时，可以监听对象所有属性，值为 false 时保持更加具体特性，必须指定到具体的属性上。

   
1. watchEffect 会初始化执行一次，在副作用发生期间追踪依赖，自动分析出侦听数据源；watchEffect 无法访问侦听数据的新值和旧值。
2. 更加抽象：使用时不需要具体指定监听的谁，回调函数内直接使用就可以

简单一句话，watch 功能更加强大，而 watchEffect 在某些场景下更加简洁。

# Watch

watch 的第一个参数可以是不同形式的“数据源”，它可以是：

1. 一个 ref
2. 一个计算属性
3. 一个 getter 函数（有返回值的函数）
4. 一个响应式对象
5. 以上类型的值组成的数组

```sh
const x = ref(1)
const y = ref(1)
const doubleX = computed(() => x.value * 2)
const obj = reactive({ count: 0 })

// 单个 ref
watch(x, (newValue) => {
  console.log(`x is ${newValue}`)
})

// 计算属性
watch(doubleX, (newValue) => {
  console.log(`doubleX is ${newValue}`)
})

// getter 函数
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// 响应式对象
watch(obj, (newValue, oldValue) => {
  // 在嵌套的属性变更时触发
  // 注意：`newValue` 此处和 `oldValue` 是相等的
  // 因为它们是同一个对象！
})

// 以上类型的值组成的数组
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

注意，你不能直接侦听响应式对象的属性值，例如:

```sh
const obj = reactive({ count: 0 })

// 错误，因为 watch() 得到的参数是一个 number
watch(obj.count, (count) => {
  console.log(`count is: ${count}`)
})
```

这里需要用一个返回该属性的 getter 函数：

```sh
// 提供一个 getter 函数
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`)
  }
)
```

## 回调函数

watch 的第二个参数是数据发生变化时执行的回调函数。

这个回调函数接受三个参数：新值、旧值，以及一个用于清理副作用的回调函数。该回调函数会在副作用下一次执行前调用，可以用来清除无效的副作用，如等待中的异步请求：

```sh
const id = ref(1)
const data = ref(null)

watch(id, async (newValue, oldValue, onCleanup) => {
  const { response, cancel } = doAsyncWork(id.value)
  // `cancel` 会在 `id` 更改时调用
  // 以便取消之前未完成的请求
  onCleanup(cancel)
  data.value = await response.json()
})
```

watch 的返回值是一个用来停止该副作用的函数：

```sh
const unwatch = watch(() => {})

// ...当该侦听器不再需要时
unwatch()
```

注意：使用同步语句创建的侦听器，会自动绑定到宿主组件实例上，并且会在宿主组件卸载时自动停止。使用异步回调创建一个侦听器，则不会绑定到当前组件上，你必须手动停止它，以防内存泄漏。如下面这个例子：

```sh
<script setup>
import { watchEffect } from 'vue'

// 组件卸载会自动停止
watchEffect(() => {})

// 组件卸载不会停止！
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>
```

## 配置选项
watch 的第三个参数是一个可选的对象，支持以下选项：

immediate：在侦听器创建时立即触发回调。
deep：深度遍历，以便在深层级变更时触发回调。
flush：回调函数的触发时机。pre：默认，dom 更新前调用，post: dom 更新后调用，sync 同步调用。
onTrack / onTrigger：用于调试的钩子。在依赖收集和回调函数触发时被调用。

## 深层侦听器

直接给 watch() 传入一个响应式对象，会默认创建一个深层侦听器 —— 所有嵌套的属性变更时都会被触发：

```sh
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // 在嵌套的属性变更时触发
  // 注意：`newValue` 此处和 `oldValue` 是相等的
  // 因为它们是同一个对象！
})

obj.count++
```

相比之下，一个返回响应式对象的 getter 函数，只有在对象被替换时才会触发：

```sh
const obj = reactive({
  someString: 'hello',
  someObject: { count: 0 }
})

watch(
  () => obj.someObject,
  () => {
    // 仅当 obj.someObject 被替换时触发
  }
)
```

当然，你也可以显式地加上 deep 选项，强制转成深层侦听器：

```sh
watch(
  () => obj.someObject,
  (newValue, oldValue) => {
    // `newValue` 此处和 `oldValue` 是相等的
    // 除非 obj.someObject 被整个替换了
    console.log('deep', newValue.count, oldValue.count)
  },
  { deep: true }
)

obj.someObject.count++ // deep 1 1
```

深层侦听一个响应式对象或数组，新值和旧值是相等的。为了解决这个问题，我们可以对值进行深拷贝。

```sh
watch(
  () => _.cloneDeep(obj.someObject),
  (newValue, oldValue) => {
    // 此时 `newValue` 此处和 `oldValue` 是不相等的
    console.log('deep', newValue.count, oldValue.count)
  },
  { deep: true }
)

obj.someObject.count++ // deep 1 0
```
注意：深层侦听需要遍历所有嵌套的属性，当数据结构庞大时，开销很大。所以我们要谨慎使用，并且留意性能。


# watchEffect

watch() 是懒执行的：当数据源发生变化时，才会执行回调。但在某些场景中，我们希望在创建侦听器时，立即执行一遍回调。当然使用 immediate 选项也能实现：

```sh
const url = ref('https://...')
const data = ref(null)

async function fetchData() {
  const response = await fetch(url.value)
  data.value = await response.json()
}

// 立即执行一次，再侦听 url 变化
watch(url, fetchData, { immediate: true })
```

可以看到 watch 用到了三个参数，我们可以用 watchEffect 来简化上面的代码。watchEffect 会立即执行一遍回调函数，如果这时函数产生了副作用，Vue 会自动追踪副作用的依赖关系，自动分析出侦听数据源。上面的例子可以重写为：

```sh
const url = ref('https://...')
const data = ref(null)

// 一个参数就可以搞定
watchEffect(async () => {
  const response = await fetch(url.value)
  data.value = await response.json()
})
```

watchEffect 接受两个参数，第一个参数是数据发生变化时执行的回调函数，用法和 watch 一样。第二个参数是一个可选的对象，支持 flush 和 onTrack / onTrigger 选项，功能和 watch 相同。
注意：watchEffect 仅会在其同步执行期间，才追踪依赖。使用异步回调时，只有在第一个 await 之前访问到的依赖才会被追踪。
 

就是默认下，Vue会先执行组件DOM update，还是先执行监听器？

```sh
<template>
  <div>
    <div id="value">{{count}}</div> 
    <button @click="countAdd">增加</button>
  </div>
</template>

<script>
import { ref,watchEffect } from 'vue';

export default {
  setup(){
    let count = ref(0);
    const countAdd = () => {
      count.value++;
    }
    watchEffect(() => {
      console.log(count.value)
      console.log(document.querySelector('#value') && document.querySelector('#value').innerText)
    })
    return{
      count,
      countAdd
    }
  }
}
</script>
```

![](2023-07-21-14-34-38.png)

为什么点之前按钮的innerText打印null？
因为事实就是默认先执行监听器，然后更新DOM，此时DOM还未生成，当然是null。
当第1和2次点击完，会发现：document.querySelector('#value').innerText 获取到的总是点击之前DOM的内容。
这也说明，默认Vue先执行监听器，所以取到了上一次的内容，然后执行组件 update。

Vue 2其实也是这种机制，Vue 2使用 this.nextTick()去获取组件更新完成之后的DOM，在watchEffect里就不需要用this. nextTick() 去获取组件更新完成之后的 DOM，在 watchEffect 里就不需要用this.nextTick()去获取组件更新完成之后的DOM，在watchEffect里就不需要用this.nextTick()（也没法用），有一个办法能获取组件更新完成之后的DOM，就是使用：

```sh
// 在组件更新后触发，这样你就可以访问更新的 DOM。
// 注意：这也将推迟副作用的初始运行，直到组件的首次渲染完成。
watchEffect(
  () => {
    /* ... */
  },
  {
    flush: 'post'
  }
)
```
![](2023-07-21-14-35-39.png)

所以结论是，如果要操作“更新之后的DOM”，就要配置 flush: 'post'。

如果要操作“更新之后的DOM ”，就要配置 flush: 'post'。
flush 取值：
	pre （默认）
	post （在组件更新后触发，这样你就可以访问更新的 DOM。这也将推迟副作用的初始运行，直到组件的首次渲染完成。）
	sync （与watch一样使其为每个更改都强制触发侦听器，然而，这是低效的，应该很少需要）
