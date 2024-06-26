import fs from "fs";
import path from "path";
import { PackageConfig } from "@/types";
import { VALID_FRAMEWORK_PACKAGES } from "../datas/constants";

export function findFrameworkModuleConfigs({
  cwd,
}: {
  cwd: string;
}): PackageConfig[] {
  const packageJsonPath = path.join(cwd, "package.json");

  // 检查 package.json 文件是否存在
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`No package.json found in the directory: ${cwd}`);
  }

  // 读取 package.json 文件内容
  const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
  const packageJson: PackageConfig = JSON.parse(packageJsonContent);

  // 合并 dependencies 和 peerDependencies
  const allDependencies = {
    ...packageJson.dependencies,
    ...packageJson.peerDependencies,
  };

  // 要查找的包
  const packagesToFind = VALID_FRAMEWORK_PACKAGES;
  const foundPackages: PackageConfig[] = [];

  packagesToFind.forEach((pkg) => {
    let version = allDependencies[pkg];
    let pkgJson: PackageConfig | null = null;

    // 如果在依赖中找到
    if (version) {
      const pkgPath = path.join(cwd, "node_modules", pkg, "package.json");
      if (fs.existsSync(pkgPath)) {
        const pkgContent = fs.readFileSync(pkgPath, "utf-8");
        pkgJson = JSON.parse(pkgContent) as PackageConfig;
      }
    }

    if (pkgJson) {
      foundPackages.push(pkgJson);
    }
  });

  return foundPackages;
}
