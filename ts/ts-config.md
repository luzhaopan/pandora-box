# 1. env.d.ts
![](./img/2023-08-23-12-38-05.png)

根目录 env.d.ts添加以下配置

```
/// <reference types="vite/client" />
// vite使用的是ts，避免ts不识别 .vue 后缀的文件
declare module '*.vue' {
    import { DefineComponent } from "vue"
    const component: DefineComponent<{}, {}, any>
    export default component
}
```

# 2. global.d.ts

global.d.ts是指在TypeScript中定义全局类型的文件。它用于声明全局变量、全局函数、全局模块等，并且可以通过在项目中引用该文件，使这些全局定义在整个项目中可见。

# 3. 声明文件

声明文件必需以 .d.ts 为后缀

一般来说，ts 会解析项目中所有的 *.ts 文件，当然也包含以 .d.ts 结尾的文件。所以当我们将 jQuery.d.ts 放到项目中时，其他所有 *.ts 文件就都可以获得 jQuery 的类型定义了。

![](./img/2023-08-23-17-21-54.png)

假如仍然无法解析，那么可以检查下 tsconfig.json 中的 files、include 和 exclude 配置，确保其包含了 jQuery.d.ts 文件。

