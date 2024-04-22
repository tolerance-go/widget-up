import fs from "fs";

export const getExternalDependencies = (packageJsonPath) => {
  // 读取并解析 package.json 文件
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  // 提取 dependencies 和 peerDependencies
  const dependencies = Object.keys(packageJson.dependencies || {});
  const peerDependencies = Object.keys(packageJson.peerDependencies || {});
  const externalDependencies = new Set([...dependencies, ...peerDependencies]);

  return externalDependencies;
};
