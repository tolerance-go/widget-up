# getPeerDependTree 模块文档

## 是什么
`getPeerDependTree` 是一个用于生成项目中所有包的 `peerDependencies` 依赖树的工具函数。它通过读取项目目录下的 `package.json` 文件以及相关的依赖包的 `package.json` 文件，递归地构建出一个完整的 `peerDependencies` 依赖关系树。

## 解决什么需求
在前端开发中，`peerDependencies` 用于指定项目所依赖的包的版本范围，但不会自动安装这些依赖。为了确保所有的 `peerDependencies` 都满足其版本要求，开发者需要手动管理这些依赖关系。`getPeerDependTree` 提供了一种自动化的方法来生成依赖树，帮助开发者更好地了解和管理项目中的 `peerDependencies`。

## 如何使用
### 安装
确保在项目中已安装 `fs` 和 `path` 模块，以及 `widget-up-utils` 包。
```bash
npm install widget-up-utils
```

### 示例代码
以下是如何使用 `getPeerDependTree` 函数的示例：
```typescript
import getPeerDependTree from "./path/to/module";

const options = { cwd: process.cwd() };
const peerDependenciesTree = getPeerDependTree(options);

console.log(JSON.stringify(peerDependenciesTree, null, 2));
```

### 参数说明
- `options`: 一个对象，包含以下属性：
  - `cwd`: 当前工作目录的路径。
- `deps`: 可选参数，包含以下属性：
  - `fs`: 文件系统模块，默认为 `nodeFs`。
  - `path`: 路径模块，默认为 `nodePath`。

### 返回值
`getPeerDependTree` 返回一个 `PeerDependenciesTree` 对象，表示所有 `peerDependencies` 的依赖关系树。

### 类型定义
```typescript
import { VersionData } from "widget-up-utils";

export type PeerDependenciesNode = {
  name: string;
  version: VersionData;
  peerDependencies?: PeerDependenciesTree;
};

export interface PeerDependenciesTree {
  [packageName: string]: PeerDependenciesNode;
}
```

## 注意事项
1. **错误处理**：在读取 `package.json` 文件时，如果发生错误（例如文件不存在或解析失败），函数会捕获并记录错误信息，然后继续处理其他依赖。
2. **递归调用**：该函数通过递归调用 `findPeerDependencies` 来处理嵌套的 `peerDependencies`，可能会对性能产生影响，特别是在依赖关系非常复杂的项目中。
3. **默认参数**：默认使用 `nodeFs` 和 `nodePath` 模块，如果需要，可以传入自定义的 `fs` 和 `path` 模块。

通过使用 `getPeerDependTree`，开发者可以轻松地生成并查看项目中所有包的 `peerDependencies` 依赖树，从而更好地管理项目依赖。