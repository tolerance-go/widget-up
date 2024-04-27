# html-render

# 是什么

- 是 rollup 的插件，用 ts 编写
- 他读取执行环境下的 index.html.ejs，然后进行渲染（使用 ejs 模板引擎），写入到 dist 目录下
- 并且一旦 index.html.ejs 内容发生改变自动重新渲染再次写入

# 解决什么问题

- 开发的时候需要动态生成 index.html 网页入口文件配合静态服务器使用

# 如何使用

```js
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import del from "rollup-plugin-delete";
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
    isProduction && del({ targets: "dist/*" }),
    resolve(),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
    }),
    isProduction && terser(),
    peerDependenciesAsExternal(),
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
