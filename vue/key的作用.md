# key作用

key 是给每一个 vnode 的唯一id，也是 diff 的一种优化策略，可以根据 key，更准确、更快的找到对应的 vnode 节点

## 为什么不推荐使用 index 作为 key？

因为如果使用 index 作为 key，那么在元素顺序改变的时候，Vue 会认为它是相同的内容，就不会触发更新。

## 为什么不推荐使用随机数作为 key？

因为如果使用随机数作为 key，那么在元素顺序改变的时候，Vue 会认为它是不同的内容，就会触发更新。

## 为什么不推荐使用每帧的唯一 id 作为 key？

因为如果使用每帧的唯一 id 作为 key，那么在元素顺序改变的时候，Vue 会认为它是不同的内容，就会触发更新。