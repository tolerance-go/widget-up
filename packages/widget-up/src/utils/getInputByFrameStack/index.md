# 是什么

- 一个 ts 函数
- 根据前端技术栈名获取入口 list

# 解决什么问题

- 生成 start.js 的时候，最顶层的入口文件列表需要根据前端技术栈生成

# 如何使用

```ts
import getInputByFrame from "./getInputByFrame";

const [{
    name: "widget-up-connector-react16",
    version: "0.0.0",
    scriptSrc: () => "/demos/comp.react16.alias-wrap.async-wrap.js",
    depends: [],
}] = getInputByFrame([
  {
    name: "React",
    version: "16.8.0",
  },
]);
```
