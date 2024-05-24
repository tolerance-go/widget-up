import { PackageConfig } from "./module";
import { VersionData } from "./version";

export type PeerDependenciesNode = {
  name: string;
  version: VersionData;
  peerDependencies?: PeerDependenciesTree;
  packageConfig: PackageConfig;
  /**
   * 依赖所在的 module 的 path
   * 比如依赖 A 前置依赖 B，
   * 那么 B 的 hostModulePath 就是 A 所在的路径
   */
  hostModulePath: string;
};

export interface PeerDependenciesTree {
  [packageName: string]: PeerDependenciesNode;
}
