# html-render

# 是什么

- 是 rollup 的插件，用 ts 编写
- 他读取执行环境下的 index.html.ejs，然后进行渲染（使用 ejs 模板引擎），写入到 dist 目录下
- 并且一旦 index.html.ejs 内容发生改变自动重新渲染再次写入

# 解决什么问题

- 开发的时候需要动态生成 index.html 网页入口文件配合静态服务器使用

# 如何使用

- 支持传入 options 参数，在 ejs 模板渲染的时候可以使用

```js
import serveRenderLivereload from "serveRenderLivereload";
import htmlRender from "html-render";

const isProduction = process.env.NODE_ENV === "production";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "umd",
  },
  plugins: [
    !isProduction &&
      htmlRender({
        dest: "dist",
        src: "index.html.ejs",
      }),
    !isProduction &&
      serveRenderLivereload({
        contentBase: "dist",
        port: 3000,
      }),
  ].filter(Boolean),
  watch: {
    include: "src/**",
  },
};
```
