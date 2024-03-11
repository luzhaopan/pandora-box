# keep-alive原理

keep-alive 实现了组件的缓存，当组件切换时不会对当前组件进行卸载。

常用的属性 include / exclude 以及max属性，

2个生命周期 activated / deactivated，以及 LRU 算法。

keepAlive内部的组件来回切换时，就不需要重新创建组件实例，而是直接使用缓存中的实例，一方面可以避免创建组件带来的效率开销，另一方面可以保留组件的状态

keepAlive有include和exclude属性，这两个属性决定哪些组件可以进入缓存。另外还有一个max属性，通过它可以设置最大缓存数，当缓存的实例超过设置的数时，vue 会移除最久没有使用的组件缓存。

# 生命周期钩子

keep-alive提供了两个生命钩子，分别是activated与deactivated。

因为keep-alive会将组件保存在内存中，并不会销毁以及重新创建，所以不会重新调用组件的created等方法，需要用activated与deactivated这两个生命钩子来得知当前组件是否处于活动状态。

组件一旦被keep-alive缓存，那么再次渲染的时候就不会执行 created、mounted 等钩子函数。使用keep-alive组件后，被缓存的组件生命周期会多activated和deactivated 两个钩子函数，它们的执行时机分别是keep-alive包裹的组件激活时调用和停用时调用。第一次 activated 触发是在 mounted 之后


# 原理

## 源码

```sh
export default {
  name: 'keep-alive',
  abstract: true,
 
  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number]
  },
 
  created () {
    this.cache = Object.create(null)
    this.keys = []
  },
 
  destroyed () {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },
 
  mounted () {
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },
 
  render() {
    /* 获取默认插槽中的第一个组件节点 */
    const slot = this.$slots.default
    const vnode = getFirstComponentChild(slot)
    /* 获取该组件节点的componentOptions */
    const componentOptions = vnode && vnode.componentOptions
 
    if (componentOptions) {
      /* 获取该组件节点的名称，优先获取组件的name字段，如果name不存在则获取组件的tag */
      const name = getComponentName(componentOptions)
 
      const { include, exclude } = this
      /* 如果name不在inlcude中或者存在于exlude中则表示不缓存，直接返回vnode */
      if (
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }
 
      const { cache, keys } = this
      const key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      } else {
        cache[key] = vnode
        keys.push(key)
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }
 
      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
```
可以看到，它有3个属性，即有3个props。此外，它有created，destroyed，mounted，render四个钩子


在具体实现上，keep-alive 在内部维护了一个 key 数组和一个缓存对象

```sh
//keep-alive 内部声明周期函数
  created () {
    this.cache = Object.create(null)
    this.keys = []
  }
```

key 数组记录目前缓存的组件 key 值，如果组件没有指定 key 值，会自动生成一个唯一的 key 值

cache 对象会以 key 值为键，vnode 为值，用于缓存组件对应的虚拟 DOM

在 keep-alive 的渲染函数中，其基本逻辑是判断当前渲染的 vnode 是否有对应的缓存，如果有，会从缓存中读取到对应的组件实例，如果没有就会把它缓存。

当缓存的数量超过max设置的数值时，keep-alive会移除 key 数组中的第一个元素

为什么要删除第一个缓存组件并且为什么命中缓存了还要调整组件key的顺序？这其实应用了一个缓存淘汰策略

LRU：
LRU（Least recently used，最近最少使用）算法根据数据的历史访问记录来进行淘汰数据，其核心思想是“如果数据最近被访问过，那么将来被访问的几率也更高”。