# 是什么

- 基于 html 的依赖自动管理工具
- ts 编写的 类
- 传入 dom，自动维护网页的 script 和 link 依赖标签
- fetchVersionList 自带缓存机制
  - 如果是精确版本号添加的依赖，不会触发
- 内部先是通过 getSortedDependencies 得到排序后的依赖列表，然后把这个列表数据转换为渲染到页面上的数据结构列表，然后每次对比前后2次的数据，去操作 html 的 dom 中的 tag，包括 script 和 link

# 解决什么需求

- 自动管理网页 head 的 umd 依赖
- 已经存在的 head 中的 link 和 script 在更新时不受影响
  - 生成的 tag 在已经存在的 tag 的前面插入
- 生成的样式在脚本前面
- 网页动态生成的 script 无法保证执行顺序，哪怕是 fragment 批量更新，哪怕是 defer 属性，哪怕是同步更新标签


# 如何使用

```ts
const htmlDependencyManager = new HTMLDependencyManager({
  fetchVersionList: async () => ["1.0.0", "2.0.0"],
  document,
  scriptSrcBuilder: (dep) => `path/to/${dep.name}@${dep.version}.js`,
  linkHrefBuilder: (dep) => `path/to/${dep.name}@${dep.version}.css`,
});
```

# 参考资料

## defer 和 async 的行为
- defer: 仅对**静态 HTML** 文档中出现的 `<script>` 标签有效。它保证脚本在整个文档解析完毕后、DOMContentLoaded 事件触发前执行，且脚本执行顺序与文档中出现的顺序一致。
- async: 对于静态和动态添加的 `<script>` 标签都有效。异步脚本不保证按照特定顺序执行，仅保证会在加载完成后尽快执行。