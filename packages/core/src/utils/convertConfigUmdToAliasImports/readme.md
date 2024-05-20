# 是什么

- 是 ts 函数
- 将 config 中的 umd 转换为 wrapUMDAliasCode 的入参的 imports
- globalVar 是 globals 中的 value，并且使用 packageConfig 里面对应包的 version 范围内的最新版本，转换为版本 id 拼接

# 解决什么需求

- umd 配置转换 别名包裹 code 的入参

# 如何使用

```ts
import { convertConfigUmdToAliasImports } from "...";

convertConfigUmdToAliasImports({
  umdConfig,
  packageConfig,
});
```
