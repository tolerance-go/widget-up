# convertDependenciesTreeToList

## 是什么

`convertDependenciesTreeToList` 是一个用于将依赖树转换为叶子节点数据列表的函数。它接受一个表示依赖关系的树结构，并返回所有叶子节点的信息列表。

## 解决什么需求

在依赖管理中，了解所有最终依赖的具体信息（即叶子节点）对于分析和处理依赖冲突、优化依赖树结构等操作非常重要。`convertDependenciesTreeToList` 提供了一种简便的方法，将复杂的依赖树结构转换为一个包含叶子节点详细信息的列表，便于进一步的处理和分析。

## 如何使用

### 函数签名

```typescript
function convertDependenciesTreeToList(
  tree: PeerDependenciesTree
): PeerDependenciesNode[];
```

### 参数

- `tree: PeerDependenciesTree`：依赖树，表示项目中各个依赖及其子依赖的关系。

### 返回值

- `PeerDependenciesNode[]`：包含所有叶子节点的数组，每个节点包含以下属性：
  - `version: string`：依赖的版本号。
  - `name: string`：依赖的名称。

### 示例

假设我们有如下依赖树：

```typescript
const dependenciesTree = {
  packageA: {
    version: "1.0.0",
    name: "packageA",
    peerDependencies: {
      packageB: {
        version: "1.1.0",
        name: "packageB",
        peerDependencies: {
          packageC: {
            version: "1.2.0",
            name: "packageC",
            peerDependencies: {},
          },
        },
      },
    },
  },
};
```

我们可以使用 `convertDependenciesTreeToList` 函数将其转换为叶子节点列表：

```typescript
const leafNodes = convertDependenciesTreeToList(dependenciesTree);
console.log(leafNodes);
// 输出: [{ version: "1.2.0", name: "packageC" }]
```

## 注意事项

- 该函数假定 `PeerDependenciesTree` 结构中的每个节点包含 `version` 和 `name` 属性。
- 当 `peerDependencies` 为空或不存在时，当前节点被视为叶子节点并被收集。
- 该函数采用递归方式遍历依赖树，因此对于非常深的依赖树结构，需要注意可能的栈溢出问题。
