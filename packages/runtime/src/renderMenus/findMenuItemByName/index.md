## 是什么

`findMenuItemByName` 是一个 TypeScript 函数，定义在 `"widget-up-utils"` 包中。该函数用于在菜单项数组中递归搜索具有指定名称的菜单项。函数接受一个 `DemoMenuItem[]` 类型的数组和一个 `string` 类型的名称作为参数，返回一个 `DemoMenuItem` 类型的对象或者在未找到匹配项时返回 `undefined`。

## 解决什么需求

此函数主要解决了在具有嵌套结构的菜单项数据中查找特定名称菜单项的需求。通过递归搜索，即使在多级嵌套的菜单结构中，也能有效地找到并返回匹配的菜单项。这对于动态菜单显示、权限控制、用户界面更新等功能非常有用。

## 如何使用

要使用 `findMenuItemByName` 函数，首先需要确保您已经引入了 `DemoMenuItem` 类型，并且已经有一个 `DemoMenuItem[]` 类型的数组可用于搜索。以下是如何在实际项目中使用这个函数的示例：

```typescript
import { DemoMenuItem, findMenuItemByName } from "widget-up-utils";

// 示例菜单项数组
const menuItems: DemoMenuItem[] = [
  { name: "文件", children: [{ name: "新建" }, { name: "打开" }] },
  { name: "编辑", children: [{ name: "复制" }, { name: "粘贴" }] },
];

// 查找名为 "复制" 的菜单项
const menuItem = findMenuItemByName(menuItems, "复制");

// 输出找到的菜单项，如果没有找到，则输出 undefined
console.log(menuItem);
```

## 注意事项

1. **递归性能**：由于 `findMenuItemByName` 使用了递归调用，如果菜单项数组很大或嵌套层次非常深，可能会影响性能。建议对菜单项的总数和嵌套深度进行限制。
2. **错误处理**：函数在未找到任何匹配项时返回 `undefined`，调用此函数时应检查返回值以避免空引用错误。
3. **类型安全**：确保传递给函数的 `items` 参数严格符合 `DemoMenuItem[]` 类型，避免类型不匹配导致的运行时错误。

使用此函数时，请考虑上述注意事项以确保代码的健壮性和性能。
