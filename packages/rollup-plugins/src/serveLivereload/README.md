# 是什么

- 是 rollup 的插件，用 ts 编写
- 他监听指定文件夹内容作为本地服务器的根目录
- 并且一旦根目录内容发生改变自动刷新网页

# 如何使用

```js
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import del from "rollup-plugin-delete";
import serveRenderLivereload from "serveRenderLivereload";

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