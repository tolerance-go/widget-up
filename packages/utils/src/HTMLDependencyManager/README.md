# 是什么

- 基于 html 的依赖自动管理工具
- ts 编写的 类
- 传入 dom，自动维护网页的 script 和 link 依赖标签
- fetchVersionList 自带缓存机制

# 解决什么需求

- 自动管理网页 head 的 umd 依赖
- 已经存在的 head 中的 link 和 script 在更新时不受影响
  - 生成的 tag 在已经存在的 tag 的前面插入
- 生成的样式在脚本前面

# 如何使用

```ts
const htmlDependencyManager = new HTMLDependencyManager({
  fetchVersionList: async () => ["1.0.0", "2.0.0"],
  document,
  scriptSrcBuilder: (dep) => `path/to/${dep.name}@${dep.version}.js`,
  linkHrefBuilder: (dep) => `path/to/${dep.name}@${dep.version}.css`,
});
```
