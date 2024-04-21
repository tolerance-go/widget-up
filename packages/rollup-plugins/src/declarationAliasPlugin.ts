import { Plugin } from "rollup";
import fs from "fs";
import path from "path";
import * as glob from "glob";
import stripJsonComments from "strip-json-comments";

interface TsConfig {
  compilerOptions: {
    baseUrl: string;
    paths: { [key: string]: string[] };
    declarationDir?: string;
  };
}

const replaceAliases = (
  fileContent: string,
  paths: { [key: string]: string[] },
  baseUrl: string,
  filePath: string
): string => {
  const fileDir = path.dirname(filePath);

  // 遍历所有的别名
  for (const alias in paths) {
    if (paths.hasOwnProperty(alias)) {
      const targets = paths[alias]; // 目标路径数组
      targets.forEach(target => {
        // 构建用于匹配的正则表达式，匹配形如 import/export ... from 'alias/...'
        const aliasPattern = new RegExp(`(['"])${alias}/`, 'g');
        
        // 移除路径中的通配符，计算相对路径
        const cleanTarget = target.replace(/\*$/, ''); // 移除路径末尾的通配符
        const targetPath = path.resolve(baseUrl, cleanTarget);
        let relativePath = path.relative(fileDir, targetPath).replace(/\\/g, '/');
        
        // 确保路径是以 ./ 或 ../ 开始，避免出现导入错误
        if (!relativePath.startsWith('.')) relativePath = './' + relativePath;

        // 替换文件内容中的别名路径
        fileContent = fileContent.replace(aliasPattern, `$1${relativePath}/`);
      });
    }
  }

  return fileContent;
};

const declarationAliasPlugin = (): Plugin => {
  return {
    name: "declaration-alias",
    writeBundle() {
      const tsConfigPath = path.resolve("./tsconfig.json");
      console.log("tsConfigPath", tsConfigPath);

      const tsConfigText = fs.readFileSync(tsConfigPath, "utf8");
      const cleanedJson = stripJsonComments(tsConfigText);

      const tsConfig: TsConfig = JSON.parse(cleanedJson);
      const baseUrl = tsConfig.compilerOptions.baseUrl;
      const paths = tsConfig.compilerOptions.paths;
      const declarationDir = tsConfig.compilerOptions.declarationDir;

      if (!declarationDir) {
        throw new Error("declarationDir not defined.");
      }

      const files = glob.sync(`${declarationDir}/**/*.d.ts`);
      files.forEach((file: string) => {
        let content = fs.readFileSync(file, "utf8");
        content = replaceAliases(content, paths, baseUrl, file);
        fs.writeFileSync(file, content);
      });
    },
  };
};

export default declarationAliasPlugin;
