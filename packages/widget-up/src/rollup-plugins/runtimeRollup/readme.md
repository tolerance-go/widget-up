# 是什么

- ts 编写的 rollup 插件
- 他在运行时调用 rollup

# 解决什么需求

- 传递参数动态构建打包

# 如何使用

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
