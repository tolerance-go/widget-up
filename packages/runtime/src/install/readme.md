# 是什么

- ts 编写的方法
- 内部维护 HTMLDependencyManager 类
- 它接受一个组件和它的依赖树，内部解析依赖树，然后调用 addDependency 安装依赖
- 它内部自动淘宝 npm 源头请求依赖的版本列表
- scriptSrcBuilder 和 linkHrefBuilder
- 传入的依赖树节点里面包含一个是否存在样式，以及包含脚本和样式资源的 src 和 href 链接，方法内部会自动处理传递给 HTMLDependencyManager

# 解决什么需求

- 它负责初始化安装组件的依赖

# 如何使用

```ts
import { install } from "./install";

install([
  {
    name: "inputReact16",
    version: "0.1.0",
    scriptSrc: "...",
    depends: [
      {
        name: "react",
        version: "^16.8.0",
        scriptSrc: "...",
      },
      {
        name: "comp1",
        version: "0.1.0",
        depends: [
          {
            name: "react",
            version: "^16.8.0",
            scriptSrc: "...",
          },
          {
            name: "module1",
            version: "^1.0.0",
            scriptSrc: "...",
            linkHref: "...",
            depends: [
              {
                name: "module2",
                version: "^1.0.0",
                scriptSrc: "...",
                linkHref: "...",
              },
            ],
          },
        ],
      },
    ],
  },
]);
```
