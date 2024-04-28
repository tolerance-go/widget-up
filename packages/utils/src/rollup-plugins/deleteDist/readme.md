# deleteDist

# 是什么

- rollup 插件
- ts 编写
- 在 buildStart 的时候删除指定目录
- 支持只运行一次

# 解决什么问题

- 开发的时候只在第一次删除，因为后续插件可能会监听 dist 内容的修改

# 如何使用

- node>=16.8

```js
import { deleteDist } from '...';

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "esm",
  },
  plugins: [
   deleteDist({
    dist: 'dist',
    once: true,
   })
  ].filter(Boolean), 
  watch: {
    include: "src/**", 
  },
};
```