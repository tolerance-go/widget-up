# 是什么

`parseDirectoryStructure` 是一个用于解析目录结构的 TypeScript 模块。它提供了一种递归遍历文件系统的方法，并将指定目录及其子目录和文件解析为一个 `DirectoryStructure` 对象。

# 解决什么需求

在文件系统操作中，常常需要对目录及其内容进行遍历和处理。`parseDirectoryStructure` 模块通过递归方式解析目录结构，生成一个包含目录和文件信息的树状对象，方便对目录内容进行进一步的操作和分析。

# 如何使用

首先，确保你的项目中已经安装了 `fs` 和 `path` 模块。这些模块是 Node.js 内置模块，因此不需要额外安装。

### 代码示例

```typescript
import nodeFs from "fs";
import nodePath from "path";
import { parseDirectoryStructure, DirectoryStructure } from "./path/to/your/module";

// 定义要解析的目录路径
const directoryPath = "/path/to/your/directory";

// 解析目录结构
try {
  const directoryStructure: DirectoryStructure = parseDirectoryStructure(directoryPath);
  console.log(JSON.stringify(directoryStructure, null, 2));
} catch (error) {
  console.error("Error parsing directory:", error);
}
```

### 输出示例

假设指定目录包含以下结构：

```
/path/to/your/directory
├── file1.txt
├── file2.txt
└── subdirectory
    └── file3.txt
```

运行上述代码后，将会输出类似以下内容的 JSON 对象：

```json
{
  "name": "directory",
  "type": "directory",
  "path": "/path/to/your/directory",
  "children": [
    {
      "name": "file1.txt",
      "type": "file",
      "path": "/path/to/your/directory/file1.txt"
    },
    {
      "name": "file2.txt",
      "type": "file",
      "path": "/path/to/your/directory/file2.txt"
    },
    {
      "name": "subdirectory",
      "type": "directory",
      "path": "/path/to/your/directory/subdirectory",
      "children": [
        {
          "name": "file3.txt",
          "type": "file",
          "path": "/path/to/your/directory/subdirectory/file3.txt"
        }
      ]
    }
  ]
}
```

# 注意事项

1. **错误处理**：在调用 `parseDirectoryStructure` 时，需要确保传入的路径是一个有效的目录路径。如果路径不存在或不是目录，将会抛出错误。
2. **性能**：由于该模块使用递归方式遍历目录，对于包含大量文件和子目录的深层次目录结构，可能会导致性能问题。在这种情况下，可以考虑实现更加优化的遍历算法。
3. **依赖性**：该模块依赖 Node.js 的内置模块 `fs` 和 `path`，因此仅适用于 Node.js 环境，不适用于浏览器环境。
4. **可扩展性**：如果需要对目录或文件进行额外的处理，可以在 `parseDirectory` 函数中添加相应的逻辑。