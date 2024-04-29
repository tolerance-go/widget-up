# 是什么

- ts 编写的类
- 自动管理依赖
- 允许同时存在同一个依赖的多个版本号
- 支持添加范围依赖，自动找到给定版本号 list 的最新版本号
- 将依赖树中的节点引用，平铺到根下

# 解决什么需求

- 版本依赖关系数据结构化
- 自动维护版本关系数据

# 如何使用

```ts
const depManager = new DependencyManager({
  lodash: ["4.17.15", "4.17.20", "4.17.21"],
  react: ["16.8.0", "16.12.0", "17.0.0"],
  axios: ["0.19.0", "0.19.2", "0.21.1"],
});

depManager.addDependency("react", "^16.8.0", {
  lodash: "^4.17.15",
});

depManager.getDependencies();
```
