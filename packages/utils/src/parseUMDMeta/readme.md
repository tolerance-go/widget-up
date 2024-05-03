# 是什么

- 这是一个 ts 函数
- 他自动解析 umd 的文件内容的头部，然后自动解析得到 imports 的依赖和导出的命名

# 解决什么需求

- 配合 modifyUMDScript 使用，注入依赖和导出信息

# 如何使用

```ts
import { parseUMDMeta } from "./parseUMDMeta";

type UMDMeta = {
  importGlobals?: string[];
  exportGlobal: string;
};

const umdMeta = parseUMDMeta({
  scriptContent: "",
});
```
