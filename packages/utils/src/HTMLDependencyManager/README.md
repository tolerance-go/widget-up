# 是什么

- 基于 html 的依赖自动管理工具
- ts 编写的 类
- 传入 dom，自动维护网页的 script 和 link 依赖标签

# 解决什么需求

- 自动管理网页的 umd 依赖

# 如何使用

```ts
const htmlDependencyManager = new HTMLDependencyManager({
  fetchVersionList: async () => ["1.0.0", "2.0.0"],
  document,
  scriptSrcBuilder: (dep) => `path/to/${dep.name}@${dep.version}.js`,
  linkHrefBuilder: (dep) => `path/to/${dep.name}@${dep.version}.css`,
});
```
