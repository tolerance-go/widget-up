# genTempAssert

# 是什么

- rollup 插件
- ts 编写
- 可以复制文件到 cwd 下的 .wup 目录下

# 解决什么问题

- 在 html-render 插件之前，提前生成一个 index.html.ejs 文件到 .wup 目录下

# 如何使用

## 前置条件

- node>=16.8

```js
import { genTempAssert } from '...';

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "esm",
  },
  plugins: [
   genTempAssert({
    src: 'tpls/index.html.ejs',
   })
  ].filter(Boolean), 
  watch: {
    include: "src/**", 
  },
};
```