import path from "path";
import { RollupOptions } from "rollup";
import del from "rollup-plugin-delete";
import { getEnv } from "../env";

export const getDevRollupConfig = ({
  rootPath,
}: {
  rootPath: string;
}): RollupOptions => {
  const { BuildEnvIsDev, BuildEnv } = getEnv();
  return {
    input: path.join(rootPath, "src/devInputs/index.jquery.ts"),
    output: {
      file: "dist/server/index.js",
      format: "iife",
      sourcemap: BuildEnvIsDev ? "inline" : false,
    },
    plugins: [del({ targets: "dist/server/*" })],
  };
};
