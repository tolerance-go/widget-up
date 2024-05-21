# convertConfigUmdToAliasImports

## 是什么

`convertConfigUmdToAliasImports` 是一个用于将 UMD 配置转换为别名导入的函数。它接受一个包含外部依赖和全局变量的配置对象，并返回一个包含转换后导入配置的数组。

## 解决什么需求

在使用 UMD 模块时，通常需要处理外部依赖并将其映射到全局变量。这些全局变量有时需要根据版本号进行唯一化，以避免命名冲突。`convertConfigUmdToAliasImports` 函数通过解析 NPM 包信息并生成带有版本号标识的全局变量名，解决了这一需求。

## 如何使用

### 导入

首先，确保你已经安装了 `widget-up-utils` 依赖，并正确导入所需的模块和函数：

```typescript
import {
  NormalizedUMDConfig,
  UMDAliasOptions,
  resolveNpmInfo,
  semverToIdentifier,
} from "widget-up-utils";
```

### 示例代码

以下是如何使用 `convertConfigUmdToAliasImports` 函数的一个示例：

```typescript
const umdConfig = {
  external: ["react", "lodash"],
  globals: {
    react: "React",
    lodash: "_",
  },
};

const aliasImports = convertConfigUmdToAliasImports(umdConfig);

console.log(aliasImports);
```

### 函数定义

```typescript
export const convertConfigUmdToAliasImports = ({
  external,
  globals,
}: {
  external: NormalizedUMDConfig["external"];
  globals: NormalizedUMDConfig["globals"];
}) => {
  const imports: UMDAliasOptions["imports"] = [];

  // 处理每个外部库配置
  external.forEach((libName) => {
    const globalVar = globals[libName]; // 获取全局变量名称
    if (!globalVar) {
      throw new Error(`Global variable not found for ${libName}`);
    }

    const libData = resolveNpmInfo({ name: libName });

    imports.push({
      globalVar: `${globalVar}_${semverToIdentifier(
        libData.packageJson.version
      )}`,
      scopeVar: globalVar,
    });
  });

  return imports;
};
```

## 注意事项

1. **错误处理**: 如果在 `globals` 中找不到对应 `external` 的全局变量名，函数会抛出一个错误。
2. **依赖解析**: 该函数依赖于 `resolveNpmInfo` 函数来获取 NPM 包信息，因此在使用前需要确保 `resolveNpmInfo` 已经正确实现。
3. **版本标识**: 使用 `semverToIdentifier` 函数将版本号转换为标识符，以避免不同版本的库之间的命名冲突。