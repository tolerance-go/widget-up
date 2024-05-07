# genAssert

# 是什么

- rollup 插件
- ts 编写
- 可以复制文件到 cwd 下的 .wup 目录下
- 可以复制内存中的数据，包括文件名称和文件内容字符串到 cwd 下的 .wup 目录下
- 支持传入 dest，默认为 cwd/.wup

# 解决什么问题

- 在 html-render 插件之前，提前生成一个 index.html.ejs 文件到 .wup 目录下

# 如何使用

## 前置条件

- node>=16.8

```js
import { genAssert } from '...';

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "esm",
  },
  plugins: [
   genAssert({
    src: 'tpls/index.html.ejs',
   })
  ].filter(Boolean), 
  watch: {
    include: "src/**", 
  },
};
```


```js
import { genAssert } from '...';

const packageConfig = {...}

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "esm",
  },
  plugins: [
   genAssert({
    dest: 'dist/server'
    file: {
      name: 'packageConfig.json',
      content: JSON.stringify(packageConfig)
    },
   })
  ].filter(Boolean), 
  watch: {
    include: "src/**", 
  },
};
```