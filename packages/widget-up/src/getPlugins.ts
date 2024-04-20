import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import livereload from "rollup-plugin-livereload";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import { PackageJson, ParseConfig } from "widget-up-utils";
import { customHtmlPlugin } from "./customHtmlPlugin.js";
import { getServerConfig } from "./getServerConfig.js";
import { isDev } from "./env.js";
import replace from "@rollup/plugin-replace";

export const getPlugins = (
  config: ParseConfig,
  packageConfig: PackageJson,
  globals: Record<string, string>
) => {
  const plugins = [
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      preventAssignment: true,
    }),
    resolve(),
    commonjs(),
    json(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: isDev
          ? {
              declaration: false,
            }
          : {
              declarationDir: "dist/types",
            },
      },
    }),
    babel({
      babelHelpers: "runtime",
      presets: ["@babel/preset-env", "@babel/preset-react"],
      plugins: ["@babel/plugin-transform-runtime"],
    }),
    config.css &&
      postcss({
        extract: true, // 提取 CSS 到单独的文件
        ...(config.css === "modules"
          ? {
              modules: true,
            }
          : config.css === "autoModules"
          ? {
              autoModules: true,
            }
          : {}),
      }),
    getServerConfig(),
    isDev &&
      livereload({
        watch: "dist", // 监听文件夹
      }),
    isDev &&
      customHtmlPlugin({
        globals,
        src: "../tpls/index.html.ejs",
        dest: "dist",
        packageConfig,
        config,
      }),
    isDev &&
      copy({
        targets: [{ src: "external", dest: "dist" }],
      }),
    copy({
      targets: [{ src: "widget-up.json", dest: "dist" }],
    }),
    !isDev && terser(), // 仅在生产模式下压缩代码
  ].filter(Boolean);

  return plugins;
};
