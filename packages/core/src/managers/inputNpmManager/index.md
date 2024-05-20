# 是什么

- 一个 ts 类

# 解决什么问题

- 本地入口包的管理
- 根据名称获取入口包的版本
- 缓存入口包信息
- 如果不存在报错

# 如何使用

```ts
import getInputNpmManager from "./getInputNpmManager";

const inputNpmManager = getInputNpmManager({
  cwd,
});

inputNpmManager.getInputByName("widget-up-connector-react16");
```
