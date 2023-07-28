#  Set、Map、WeakSet 和 WeakMap 的区别

https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/6

# Set

1. 成员唯一、无序且不重复
2. [value, value]，键值与键名是一致的（或者说只有键值，没有键名）
3. 可以遍历，方法有：add、delete、has
   
# WeakSet

1. 成员都是对象
2. 成员都是弱引用，可以被垃圾回收机制回收，可以用来保存DOM节点，不容易造成内存泄漏
3. 不能遍历，方法有add、delete、has
   
# Map

1. 本质上是键值对的集合，类似集合
2. 可以遍历，方法很多可以跟各种数据格式转换

# WeakMap

1. 只接受对象作为键名（null除外），不接受其他类型的值作为键名
2. 键名是弱引用，键值可以是任意的，键名所指向的对象可以被垃圾回收，此时键名是无效的
3. 不能遍历，方法有get、set、has、delete