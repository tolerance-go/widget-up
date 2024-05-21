import fs from "fs";
import path from "path";
import { PackageJson } from "@/types";
import { VALID_FRAMEWORK_PACKAGES } from "../assets/constants";

export function findFrameworkModules({ cwd }: { cwd: string }): PackageJson[] {
  const packageJsonPath = path.join(cwd, "package.json");

  // 检查 package.json 文件是否存在
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`No package.json found in the directory: ${cwd}`);
  }

  // 读取 package.json 文件内容
  const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
  const packageJson: PackageJson = JSON.parse(packageJsonContent);

  // 合并 dependencies 和 peerDependencies
  const allDependencies = {
    ...packageJson.dependencies,
    ...packageJson.peerDependencies,
  };

  // 要查找的包
  const packagesToFind = VALID_FRAMEWORK_PACKAGES;
  const foundPackages: PackageJson[] = [];

  packagesToFind.forEach((pkg) => {
    let version = allDependencies[pkg];
    let pkgJson: PackageJson | null = null;

    if (version) {
      // 如果在 dependencies 或 peerDependencies 中找到
      pkgJson = {
        name: pkg,
        version: version,
      } as PackageJson;
    } else {
      // 如果未在 dependencies 中找到，则检查 node_modules 中的包
      const pkgPath = path.join(cwd, "node_modules", pkg, "package.json");
      if (fs.existsSync(pkgPath)) {
        const pkgContent = fs.readFileSync(pkgPath, "utf-8");
        pkgJson = JSON.parse(pkgContent) as PackageJson;
      }
    }

    if (pkgJson) {
      foundPackages.push(pkgJson);
    }
  });

  return foundPackages;
}
