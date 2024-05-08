import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import path from "path";
import del from "rollup-plugin-delete";
import {
  htmlRender,
  autoExternalDependencies,
  peerDependenciesAsExternal,
  serveLivereload,
} from "widget-up-utils";

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
      compilerOptions: !isProduction
        ? {
            declaration,
          }
        : {
            declaration: true,
            declarationDir: "dist",
          },
    }),
    isProduction && terser(),
    peerDependenciesAsExternal(),
    !isProduction &&
      htmlRender({
        dest: "dist",
        src: "index.html.ejs",
      }),
    !isProduction &&
      serveLivereload({
        contentBase: "dist",
        port: 3000,
      }),
  ].filter(Boolean),
  watch: {
    include: "src/**",
  },
};
