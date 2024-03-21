![](./img/2024-01-22-21-49-32.png)

# 1.合理使用key

key 作用：
- 提高渲染效率，当 Vue 在进行虚拟 DOM 的 diff 算法比较新旧节点时，如果节点具有相同的 key，则 Vue
会认为它们是相同的节点，不会进行重新渲染，从而提高渲染效率。
- 保持组件状态，在使用 v-for 指令渲染列表时，每个列表项都应该拥有唯一的 key，这样可以在列表项顺序改变时，Vue可以准确地判断哪些列表项是新添加的，哪些列表项是已存在但位置改变的，哪些列表项是被删除的，从而保持组件状态的正确性。

# 2.数据层级不宜过深，合理设置响应式数据



# 3.通过object.freeze()冻结属性，不做响应式

Vue 会通过 Object.defineProperty 对数据进行劫持，来实现视图响应数据的变化，然而有些时候我们的组件就是纯粹的数据展示，不会有任何改变，我们就不需要 Vue 来劫持我们的数据，在大量数据展示的情况下，这能够很明显的减少组件初始化的时间，那如何禁止 Vue 劫持我们的数据呢？可以通过 Object.freeze 方法来冻结一个对象，一旦被冻结的对象就再也不能被修改了。

比如会员列表、商品列表之类的，只是纯粹的数据展示，不会有任何动态改变的场景下，就不需要对数据做响应化处理，可以大大提升渲染速度

```sh
export default {
  data: () => ({
    users: {}
  }),

  async created() {
    const users = await axios.get("/api/users");
    this.users = Object.freeze(users);
  }
}
```


# 4.使用数据时候缓存结果，不频繁取值


# 5.合理选取v-show和v-if

- v-if 是真正的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建；也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。

- v-show 就简单得多， 不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 的 display 属性进行切换。

所以，v-if 适用于在运行时很少改变条件，不需要频繁切换条件的场景；v-show 则适用于需要非常频繁切换条件的场景。

# 6.控制组件粒度，vue采用组件级更新

Vue.js的设计理念之一就是通过将应用程序分为多个可重复使用的组件来构建界面。每个组件都有自己的状态（data）、模板（template）以及行为（methods）等属性。

在Vue中，当数据发生变化时，只会影响到相关联的组件进行局部更新，而不需要对整个页面进行全量更新。这种机制被称为"组件级更新"或者"虚拟DOM diff算法"。

拆分成子组件，虽然第二次数据变化都会导致父组件的重新渲染，但是子组件却不会重新渲染，因为它的内部没有任何变化，耗时任务自然也就不会重新执行，因此性能更好。

# 7.采用函数式组件
函数式组件开销低

函数式组件是无状态，它无法实例化，没有任何的生命周期和方法。创建函数式组件也很简单，只需要在模板添加 functional 声明即可。一般适合只依赖于外部数据的变化而变化的组件，因其轻量，渲染性能也会有所提高。

对于一些纯展示，没有响应式数据，没有状态管理，也不用生命周期钩子函数的组件，我们就可以设置成函数式组件，提高渲染性能，因为会把它当成一个函数来处理，所以开销很低

原理是在 patch 过程中对于函数式组件的 render 生成的虚拟 DOM，不会有递归子组件初始化的过程，所以渲染开销会低很多

它可以接受 props，但是由于不会创建实例，所以内部不能使用 this.xx 获取组件属性，写法如下

```sh
<template functional>
  <div>
    <div class="content">{{ value }}</div>
  </div>
</template>
<script>
export default {
  props: ['value']
}
</script>

// 或者
Vue.component('my-component', {
  functional: true, // 表示该组件为函数式组件
  props: { ... }, // 可选
  // 第二个参数为上下文，没有 this
  render: function (createElement, context) {
    // ...
  }
})
```

# 8.采用异步组件

借助webpack的分包能力


# 9.合理使用keep-alive缓存组件

- 比如在表单输入页面进入下一步后，再返回上一步到表单页时要保留表单输入的内容
- 比如在列表页>详情页>列表页，这样来回跳转的场景等

我们都可以通过内置组件 <keep-alive></keep-alive> 来把组件缓存起来，在组件切换的时候不进行卸载，这样当再次返回的时候，就能从缓存中快速渲染，而不是重新渲染，以节省性能

```sh
<template>
  <div id="app">
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>
```

- 也可以用 include/exclude 来 缓存/不缓存 指定组件
- 可通过两个生命周期 activated/deactivated 来获取当前组件状态

# 10.虚拟滚动

如果是大数据很长的列表，全部渲染的话一次性创建太多 DOM 就会非常卡，这时就可以用虚拟滚动，只渲染少部分(含可视区域)区域的内容，然后滚动的时候，不断替换可视区域的内容，模拟出滚动的效果

参考 vue-virtual-scroller、vue-virtual-scroll-list

原理是监听滚动事件，动态更新需要显示的 DOM，并计算出在视图中的位移，这也意味着在滚动过程需要实时计算，有一定成本，所以如果数据量不是很大的情况下，用普通的滚动就行

# 11.分页、时间分片


# 12.不要将所有的数据都放到 data 中

data 中的数据都会增加 getter 和 setter，又会收集 watcher，这样还占内存。不需要响应式的数据我们可以定义在实例上

vue3 不要定义成响应式数据

# 13. v-for 遍历避免同时使用 v-if

为什么要避免同时使用 v-for 和 v-if

在 Vue2 中 v-for 优先级更高，所以编译过程中会把列表元素全部遍历生成虚拟 DOM，再来通过 v-if 判断符合条件的才渲染，就会造成性能的浪费，因为我们希望的是不符合条件的虚拟 DOM都不要生成

在 Vue3 中 v-if 的优先级更高，就意味着当判断条件是 v-for 遍历的列表中的属性的话，v-if 是拿不到的

所以在一些需要同时用到的场景，就可以通过计算属性来过滤一下列表，如下

```sh
<template>
    <ul>
      <li v-for="item in activeList" :key="item.id">
        {{ item.title }}
      </li>
    </ul>
</template>
<script>
// Vue2.x
export default {
    computed: {
      activeList() {
        return this.list.filter( item => {
          return item.isActive
        })
      }
    }
}

// Vue3
import { computed } from "vue";
const activeList = computed(() => {
  return list.filter( item => {
    return item.isActive
  })
})
</script>
```
# 14.使用 v-memo 缓存组件

v-memo 是一个内置的指令，它允许你缓存组件的输出，仅在依赖项更改时才重新计算。

```sh
<template>
  <div v-memo="[someValue]">
    <!-- 内容 -->
  </div>  
</template>

<script>
export default {
  data() {
    return {
      someValue: 'someValue'
    }
  }
}
</script>
```

# 15.使用 v-once 只渲染元素和组件一次

v-once 是一个内置的指令，它允许你渲染元素和组件一次，随后的重新渲染，元素/组件及其所有的子节点将被视为静态内容并跳过。这可以用于优化更新性能。    
```sh
<template>
  <div v-once>{{ message }}</div> 
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello, Vue!'
    }
  }
}
</script>
```

# 16.使用 v-pre 跳过这个元素和它的子元素的编译过程    
v-pre 是一个内置的指令，它允许你跳过这个元素和它的子元素的编译过程。这在一些场景下非常有用，例如，你想显示原始 Mustache 标签。    
```sh 
<template>    
  <div v-pre>{{ message }}</div>    
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello, Vue!'
    }
  }
}
</script>
```

# 17.路由懒加载

我们知道 Vue 是单页应用，所以如果没有用懒加载，就会导致进入首页时需要加载的内容过多，时间过长，就会出现长时间的白屏，很不利于用户体验，SEO 也不友好

所以可以去用懒加载将页面进行划分，需要的时候才加载对应的页面，以分担首页的加载压力，减少首页加载时间

没有用路由懒加载：

```sh
import Home from '@/components/Home'
const router = new VueRouter({
  routes: [
    { path: '/home', component: Home }
  ]
})
```

用了路由懒加载：

```sh
const router = new VueRouter({
  routes: [
    { path: '/home', component: () => import('@/components/Home') },
    { path: '/login', component: require('@/components/Home').default }
  ]
}
```

在进入这个路由的时候才会走对应的 component，然后运行 import 编译加载组件，可以理解为 Promise 的 resolve 机制

- import：Es6语法规范、编译时调用、是解构过程、不支持变量函数等
- require：AMD规范、运行时调用、是赋值过程，支持变量计算函数等


# 18.事件销毁

Vue 组件销毁时，会自动解绑它的全部指令及事件监听器，但是仅限于组件本身的事件

而对于定时器、 addEventListener 注册的监听器等，就需要在组件销毁的生命周期钩子中手动销毁或解绑，以避免内存泄露

```sh
<script>
export default {
    created() {
      this.timer = setInterval(this.refresh, 2000)
      addEventListener('touchmove', this.touchmove, false)
    },
    beforeDestroy() {
      clearInterval(this.timer)
      this.timer = null
      removeEventListener('touchmove', this.touchmove, false)
    }
}
</script>
```

# 19.图片懒加载

图片懒加载就是对于有很多图片的页面，为了提高页面加载速度，只加载可视区域内的图片，可视区域外的等到滚动到可视区域后再去加载

这个功能一些 UI 框架都有自带的，如果没有呢？

推荐一个第三方插件 vue-lazyload

```sh
npm i vue-lazyload -S

// main.js
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload)

// 接着就可以在页面中使用 v-lazy 懒加载图片了
<img v-lazy="/static/images/1.png">
```