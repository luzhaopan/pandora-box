# webpack中loader实行顺序

## 常规的执行顺序

一般情况下，我们在 webpack.config.js 文件中配置 rules 时，配置的都比较简单，如下配置：

```sh
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
};
```

上面这段配置，loader 的执行顺序确实是从右往左的：less-loader -> css-loader -> style-loader，然而 webpack loader 提供的能力远不止如此，下面介绍一些特例。

## 特例

1. Rule.enforce

在 rules 中，可以通过 enforce 配置来更改 loader 的执行顺序，enforce 可选值有 pre、post，不设置时就是普通的 normal loader。当设置 pre 时，loader 的执行时时机会提前；当设置为 post 时，loader 的执行时机会延后。
如下的 loader，执行顺序为 loader2 -> loader3 -> loader1：

```sh
module.exports = {
  module: {
    rules: [
      {
        test:/\.js$/,
        rules: [
          {
            loader: 'loader1'
          },
          {
            loader: 'loader2',
            enforce: 'pre'
          },
          {
            loader: 'loader3'
          }
        ]
      }
    ],
  },
};
```

2. inline loader

webpack 中的 loader 并不一定必须在 webpack.config.js 文件中配置，在代码中引入文件时，同样可以直接配置 loader，这种方式叫做 inline loader(行内 loader)。要注意的是该方式不利于代码

例如下述的这段代码，在需要引用的文件路径之前加入 loader，各个 loader 之间使用 ! 隔开，并可以在 loader 之后使用 ? 对该 loader 进行传参：

```sh
import Styles from 'style-loader!css-loader?modules!./styles.css';
```

上述的代码等价于
```sh
module.exports = {
  module: {
    rules: [
      {
        test: /.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
    ],
  },
};
```

同时 inline loader 还可以在loader 之前配置 !、-!、!! 等来修改是否对文件使用 webpack.config.js 中所配置的 loader，细节可见 inline loader。

使用 inline loader 时，其执行顺序会在 normal loader 之后，也就是说上述的等价代码相当于放在了 loader 数组最前面。

3. pitching loader
   
通常情况下，一个 loader 默认会导出一个函数，我们在这个函数中对源文件内容进行处理：

```sh
/**
 *
 * @param {string|Buffer} content 源文件的内容
 * @param {object} [map] 可以被 https://github.com/mozilla/source-map 使用的 SourceMap 数据
 * @param {any} [meta] meta 数据，可以是任何内容
 */
module.exports = function webpackLoader(content, map, meta) {
  // 你的 webpack loader 代码
}
```
上面这个函数的执行顺序就是我们常说的从右向左执行的，实际上，在（从右到左）执行 loader 之前，会先 从左到右 调用 loader 上的 pitch 方法。在 pitch 方法中，我们可以修改 request 后面的 元数据(metadata)，并且 pitch 方法如果有返回值的话可以忽略后面(右边的) loader 的结果:

```sh
/**
 *
 * @param {string|Buffer} content 源文件的内容
 * @param {object} [map] 可以被 https://github.com/mozilla/source-map 使用的 SourceMap 数据
 * @param {any} [meta] meta 数据，可以是任何内容
 */
module.exports = function webpackLoader(content, map, meta) {
  // 你的 webpack loader 代码
}

module.exports.pitch = function (remainingRequest, precedingRequest, meta) {
    meta.value = 42;
};
```

例如对于以下 use 配置：

```sh
module.exports = {
  //...
  module: {
    rules: [
      {
        //...
        use: ['a-loader', 'b-loader', 'c-loader'],
      },
    ],
  },
};
```

将会发生这些步骤：

```sh
|- a-loader `pitch`
  |- b-loader `pitch`
    |- c-loader `pitch`
      |- requested module is picked up as a dependency
    |- c-loader normal execution
  |- b-loader normal execution
|- a-loader normal execution
```

## 小结

综合来讲，webpack loader 的执行顺序是从右向左的，但是可以通过 Rule.enforce 来改变 loader 的执行顺序，enforce 为 post 时 loader 会后执行，enforce 为 pre 时 loader 会优先执行。另外还可以通过 inline-loader 的方式使用 loader，其执行时机在正常 loader 之后，但是在 postLoader 之前。所以 loader 的执行顺序为：pre loader -> normal loader -> inline loader -> post loader，同优先级情况下从右向左执行。

另外 loader 本质上是通过导出了一个函数，这个函数中对源文件代码进行处理，这也是我们通常说的 loader。但是 loader 还可以导出一个 pitch 方法，它可以修改 request 后面的元数据(metadata)，并且 pitch 方法如果有返回值的话可以忽略上一个(右边的) loader 的结果。pitching loader 的执行顺序与上


## 为什么 loader 从右向左按顺序执行

为什么 loader 从右向左按顺序执行。这个问题其实包含了两部分：

1. 按顺序执行

一般情况下，loader 的功能都是各司其职的，就比如本文开头给出的例子 less-loader -> css-loader -> style-loader。style-loader 只能处理普通的 css 文件样式，对于 less 样式是不支持的，所以它必须先依赖于 less-loader 将 less 内容转换为 css 内容，才能进一步处理。这就是为什么 loader 需要按顺序执行，不能并发执行。

当然这一点可能不是所有面试官想考察的关键，但是只要答了面试官一定会觉得你考虑问题周全。


2. 从右到左

以前我看网上关于为什么 loader 执行顺序是从左到右的面试题，都说是因为 webpack 内部是通过 compose 进行 plugins 的链式调用。

直到我自己去看了源码，发现根本没有使用 compose，而是因为上面提到的 pitching loader，webpack 通过一个 loaderIndex 字段去记录当前执行到了哪个 loader：按照正常习惯先从左到右执行 pitching loader，loaderIndex 递增；然后从右到左执行 normal loader，loaderIndex 递减。并且 pitch 方法如果有返回值的话可以忽略后面(右边的) loader 的结果。

源码部分如下：

```sh
function iteratePitchingLoaders(options, loaderContext, callback) {
	// 当前索引超过所有 loader 长度是，调用 processResource 处理资源
	if(loaderContext.loaderIndex >= loaderContext.loaders.length)
		return processResource(options, loaderContext, callback);

	// 获取当前 Loader 对象并判断它是否已经执行过 pitch 方法
	var currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];

	// 如果执行过，则直接将 loaderIndex 自增，从左往右递归调用 iteratePitchingLoaders 函数
	if(currentLoaderObject.pitchExecuted) {
		loaderContext.loaderIndex++;
		return iteratePitchingLoaders(options, loaderContext, callback);
	}

	// 如果没有执行过，则首先调用 loadLoader 函数加载 Loader 模块
	loadLoader(currentLoaderObject, function(err) {
		if(err) {
			loaderContext.cacheable(false);
			return callback(err);
		}
		var fn = currentLoaderObject.pitch;
		currentLoaderObject.pitchExecuted = true;
		if(!fn) return iteratePitchingLoaders(options, loaderContext, callback);

		runSyncOrAsync(
			fn,
			loaderContext, [loaderContext.remainingRequest, loaderContext.previousRequest, currentLoaderObject.data = {}],
			function(err) {
				if(err) return callback(err);
				var args = Array.prototype.slice.call(arguments, 1);
				// 判断 pitch 方法是否有返回值
				var hasArg = args.some(function(value) {
					return value !== undefined;
				});
				if(hasArg) {
					// 有返回值则跳过后面 loader 的执行，从右向左执行正常 loader 函数
					loaderContext.loaderIndex--;
					iterateNormalLoaders(options, loaderContext, args, callback);
				} else {
					// 没有返回值则继续向右执行后面 loader 的 pitch 方法
					iteratePitchingLoaders(options, loaderContext, callback);
				}
			}
		);
	});
}

```

## 总结

上面讲述了各种情况下 webpack loader 执行的顺序，以及为什么 loader 是从右向左按顺序执行的，可能跟很多人印象中的有所不同。所以通过上面两个问题，我们能认识到有时候一些问题不能人云亦云，还是得自己亲自探索一下比较好。