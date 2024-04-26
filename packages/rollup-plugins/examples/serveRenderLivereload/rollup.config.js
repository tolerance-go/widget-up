import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import path from "path";
import del from "rollup-plugin-delete";
import {
  autoExternalDependencies,
  peerDependenciesAsExternal,
  serveLivereload,
} from "widget-up-rollup-plugins";

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
      tsconfigOverride: !isProduction
        ? {
            compilerOptions: {
              declaration: false,
            },
          }
        : {
            compilerOptions: {
              declaration: true,
              declarationDir: "dist/types",
            },
          },
    }),
    isProduction && terser(),
    peerDependenciesAsExternal(),
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
