import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import copy from "rollup-plugin-copy";
import postcss from "rollup-plugin-postcss";

// 确定是否处于开发模式
const isDev = process.env.ROLLUP_WATCH;

export default {
  input: isDev ? "./index.tsx" : "src/index.tsx",
  output: {
    file: "dist/bundle.js",
    format: "umd",
    name: "MyComponent",
    globals: {
      react: "React_16",
      "react-dom": "ReactDOM_16",
    },
    sourcemap: isDev ? "inline" : false, // 开发模式启用源码映射
  },
  external: ["react", "react-dom"],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
    babel({ babelHelpers: "runtime" }),
    postcss({
      extract: true, // 提取 CSS 到单独的文件
      modules: true, // 启用 CSS Modules
    }),
    isDev &&
      serve({
        open: true, // 自动打开浏览器
        contentBase: ["dist"], // 服务器根目录，'.': 配置文件同级
        historyApiFallback: true, // SPA页面可使用
        host: "localhost",
        port: 3000,
      }),
    isDev &&
      livereload({
        watch: "dist", // 监听文件夹
      }),
    isDev &&
      copy({
        targets: [
          { src: "index.html", dest: "dist" },
          { src: "external", dest: "dist" },
        ],
      }),
    !isDev && terser(), // 仅在生产模式下压缩代码
  ].filter(Boolean),
};
