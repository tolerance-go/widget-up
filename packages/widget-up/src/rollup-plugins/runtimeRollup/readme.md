# 是什么

- ts 编写的 rollup 插件
- 他在运行时调用 rollup
- 根据 watch 参数决定是不是开启监听

# 解决什么需求

- 传递参数动态构建打包

# 如何使用

- 支持在写入代码前修改代码，暴露 hook，并且修改后的代码要支持 sourcemap

```ts
import { runtimeRollup } from "...";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "esm",
  },
  plugins: [
    runtimeRollup({
      input: "src/index.ts",
      output: {
        file: "dist/index.js",
        format: "esm",
      },
      plugins: [...].filter(Boolean),
      watch: {
        include: "src/**",
      },
    }),
  ].filter(Boolean),
  watch: {
    include: "src/**",
  },
};
```
