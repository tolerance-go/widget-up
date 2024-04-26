import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import path from "path";
import del from "rollup-plugin-delete";
import {
  autoExternalDependencies,
  peerDependenciesAsExternal,
  serveRenderLivereload,
} from "widget-up-rollup-plugins";

const isProduction = process.env.NODE_ENV === "production";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/umd/index.js",
    format: "umd",
  },
  plugins: [
    del({ targets: "dist/*" }),
    resolve(),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
    }),
    isProduction && terser(),
    peerDependenciesAsExternal(),
    !isProduction && serveRenderLivereload(),
  ].filter(Boolean),
  watch: {
    include: "src/**",
  },
};
