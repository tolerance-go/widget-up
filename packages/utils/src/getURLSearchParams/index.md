# `getURLSearchParams` 函数

## 是什么

`getURLSearchParams` 是一个 TypeScript 函数，用于从提供的 URL 中解析查询参数，并将这些参数以键值对的形式存储在一个对象中。该函数定义了一个名为 `URLParams` 的接口，该接口允许将任意字符串作为键，其对应值也是字符串。

## 解决什么需求

在 Web 开发中，经常需要从 URL 中提取查询参数以用于各种功能，如页面重定向、内容过滤、或是功能设置等。JavaScript 的 `URL` 和 `URLSearchParams` API 提供了解析这些参数的原生支持。`getURLSearchParams` 函数进一步封装这些 API，简化了从任意 URL 中提取查询参数的过程，同时使用 TypeScript 的类型系统增强了代码的可读性和健壮性。

## 如何使用

以下是如何在 TypeScript 项目中使用 `getURLSearchParams` 函数的示例：

1. **导入函数**：
   确保将该函数及其接口定义在项目中的适当位置，通常是一个工具库或公共函数模块。

2. **使用函数**：
   你可以通过传递一个包含查询参数的 URL 字符串来调用此函数，并接收一个 `URLParams` 对象，其中包含了从 URL 解析的所有查询参数。

   ```typescript
   const url = "https://example.com?page=1&filter=active";
   const urlParams = getURLSearchParams(url);
   console.log(urlParams); // 输出: { page: '1', filter: 'active' }
   ```

## 注意事项

1. **URL 格式**：
   确保传递给 `getURLSearchParams` 函数的 URL 是有效的，否则 `URL` 对象的构造函数可能会抛出错误。

2. **编码问题**：
   查询参数中可能包含特殊字符或空格，这些在 URL 中需要进行编码。`URLSearchParams` API 会处理这些编码问题，但在使用参数前确认它们的格式和编码是否符合预期是一个好习惯。

3. **错误处理**：
   考虑到解析错误或无效输入的可能性，增加错误处理逻辑可以提高函数的健壮性和可靠性。例如，可以添加 try-catch 块来捕获并处理构造 `URL` 对象时可能出现的错误。
