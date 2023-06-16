# tree shaking

中文（摇树），webpack构建优化中重要一环。摇树用于清除我们项目中的一些无用代码，它依赖于ES中的模块语法。Tree-shaking其实就是：把无用的模块进行“剪枝”，很多没有用到的API就不会打包到最后的包里。

比如日常使用lodash的时候

```sh
import _ from 'lodash'
```
如果如上引用lodash库，在构建包的时候是会把整个lodash包打入到我们的bundle包中的。


```sh
import _isEmpty from 'lodash/isEmpty';
```    

如果如上引用lodash库，在构建包的时候只会把isEmpty这个方法抽离出来再打入到我们的bundle包中。
这样的化就会大大减少我们包的size。所以在日常引用第三方库的时候，需要注意导入的方式。
如何开启摇树
在webpack4.x 中默认对tree-shaking进行了支持。

# vue3  tree shaking

vue3一个比较大的显著的区别就是，当你用一个bundler的时候，比如webpack或者rollup，webpack和rollup都是有tree shaking功能，但是tree shaking的前提是所有的东西都必须用ES6 module的import来写

而vue3 在浏览器里的时候依然会由一个全局的Vue对象，但是当你用了一个bundler时（比如webpack），它就没有default export，你就不能import xxx from vue，然后把vue本身当一个对象去操作。那所有的这些API全部要用import的方式import进来，这样的结果就是使得一些可能不会用到的一些功能就可以被tree shaking掉。比如说 v-model、<transition>这些功能，如果你不用的话，就不会引用到最后的包里。

Tree-shaking某种程度上来讲，也是通过编译器去实现的（记住这句话）。举例来说


