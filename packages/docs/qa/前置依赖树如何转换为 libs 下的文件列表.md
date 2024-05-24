# 前置依赖树如何转换为 libs 下的文件列表

假设我有一个数据结构，他是递归的，树形的，描述一个 npm 包的前置依赖的树形结构

每个节点的数据类型包含下面的内容

```ts
export type PeerDependenciesNode = {
  name: string;
  version: VersionData;
  peerDependencies?: PeerDependenciesTree;
  packageConfig: PackageJson;
  /**
   * 依赖所在的 module 的 path
   * 比如依赖 A 前置依赖 B，
   * 那么 B 的 hostModulePath 就是 A 所在的路径
   */
  hostModulePath: string;
  // 模块的绝对路径
  modulePath: string;
  // 模块 esm 的入口路径
  moduleEntryPath: string;
  // 模块 umd 模块入口路径
  moduleBrowserPath: string;
  // 模块样式文件的入口路径
  moduleStyleEntryPath?: string;
};
```

我现在需要递归遍历这个结构，然后动态的往文件夹里面写入数据
写入的数据包括 脚本 和 样式 2个文件，样式文件可选，根据是否存在 
moduleStyleEntryPath 来判断，如果存在对应文件，就读取然后写入
写入后的文件名约定为 `${包的名称}_${版本号id}`