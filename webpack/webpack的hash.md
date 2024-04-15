# webpack的hash

1. 为什么使用hash

当不使用hash的时候，每次打包后生成的文件名都是一样的，浏览器可能缓存上一次的结果而无法加载最新数据

2. webpack有那些 hash

- hash：每次构建时，都会生成一个全新的 hash 值，即使文件内容没变。

- chunkhash：根据不同的入口(entry)文件(Entry)内容进行计算，输出文件的 hash 值会根据不同入口文件的内容变化而变化，但如果入口文件所依赖的模块内容不变，则该 hash 值不会变。

- contenthash：根据文件内容计算 hash，只要文件内容不变，不论依赖关系如何变化，hash 值不变。

3. 随机值一样时怎么避免？

webpack 在计算 hash 后分割 chunk。产生相同随机值可能是因为这些文件属于同一个 chunk，可以将某一个文件提到独立的 chunk，放入 entry