import { Plugin } from "rollup";
import fs from "fs";
import path from "path";
import * as glob from "glob";
import stripJsonComments from "strip-json-comments";
import { replaceAliases } from "./replaceAliases";
export interface TsConfig {
  compilerOptions: {
    baseUrl: string;
    paths: { [key: string]: string[] };
    declarationDir?: string;
    outDir?: string;
  };
}

export const start = () => {
  const tsConfigPath = path.resolve("./tsconfig.json");

  const tsConfigText = fs.readFileSync(tsConfigPath, "utf8");
  const cleanedJson = stripJsonComments(tsConfigText);

  const tsConfig: TsConfig = JSON.parse(cleanedJson);
  const baseUrl = tsConfig.compilerOptions.baseUrl;
  const paths = tsConfig.compilerOptions.paths;
  const declarationDir = tsConfig.compilerOptions.declarationDir;
  const outDir = tsConfig.compilerOptions.outDir;

  if (!declarationDir && !outDir) {
    throw new Error("declarationDir or outDir not defined.");
  }

  const files = glob.sync(`${declarationDir ?? outDir}/**/*.d.ts`);
  files.forEach((file: string) => {
    let content = fs.readFileSync(file, "utf8");
    content = replaceAliases({
      fileContent: content,
      paths,
      baseUrl,
      filePath: file,
    });
    fs.writeFileSync(file, content);
  });
};
