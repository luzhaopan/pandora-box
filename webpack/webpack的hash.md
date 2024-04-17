# webpack的hash

1. 为什么使用hash

当不使用hash的时候，每次打包后生成的文件名都是一样的，浏览器可能缓存上一次的结果而无法加载最新数据

2. webpack有那些 hash

- hash：这是根据每次编译会话(compilation)来生成的 hash，每次编译都会生成一个新的 hash，都会生成一个全新的 hash 值，即使文件内容没变。因此，这种 hash 不能用于长期缓存。

- chunkhash：这是根据每个 chunk 的内容生成的 hash，当 chunk 的内容发生变化时，chunkhash 才会发生变化。这种 hash 可以用于长期缓存，但是需要注意的是，如果入口文件发生了变化，其依赖的所有 chunk 的 chunkhash 都会发生变化。

- contenthash：根据文件内容计算 hash，只有当文件内容发生变化时，contenthash 才会发生变化。只要文件内容不变，不论依赖关系如何变化，hash 值不变。这种 hash 是最精确的，也是最适合用于长期缓存的。

3. 随机值一样时怎么避免？

webpack 在计算 hash 后分割 chunk。产生相同随机值可能是因为这些文件属于同一个 chunk，可以将某一个文件提到独立的 chunk，放入 entry