import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import path from "path";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { runtimeRollup } from "widget-up-core";
import {
  deleteDist,
  htmlRender,
  peerDependenciesAsExternal,
  serveLivereload,
} from "widget-up-utils";

const isProduction = process.env.NODE_ENV === "production";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "umd",
    name: "RuntimeRollupExample",
  },
  plugins: [
    ...[
      {
        path: "demos/demo1.ts",
        name: "Demo1",
      },
      {
        path: "demos/demo2.ts",
        name: "Demo2",
      },
    ].map((input) => {
      return runtimeRollup(
        {
          input: input.path,
          output: {
            file: path.join(
              "dist",
              "demos",
              path.basename(input.path, ".ts") + ".js"
            ),
            format: "umd",
            name: input.name,
          },
          plugins: [
            isProduction && deleteDist({ dist: "dist/demos" }),
            resolve(),
            commonjs(),
            typescript({
              compilerOptions: !isProduction
                ? {
                    declaration: false,
                  }
                : {
                    declaration: true,
                    declarationDir: "dist",
                  },
            }),
            isProduction && terser(),
            peerDependenciesAsExternal(),
          ],
          overwriteChunkCode: (code, chunk) => {
            return code.replace("demo", "demodemo");
          },
          watch: !isProduction
            ? {
                include: ["demos/**", "src/**"],
              }
            : undefined,
        },
        input.path
      );
    }),
    isProduction && deleteDist({ dist: "dist" }),
    resolve(),
    commonjs(),
    typescript({
      compilerOptions: !isProduction
        ? {
            declaration: false,
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
    include: ["src/**"],
  },
};
