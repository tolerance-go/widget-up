# 是什么

- 一个 ts 编写的 bin 文件
- 命令行执行
- 输入当前 cwd 下的 glob，进行匹配文件，然后对其进行 UMD 别名的包裹
    - 成功的话，会生成同名文件的 xxx.alias-wrap.js 文件
    - 内部用的是 wrapUMDAliasCode 方法

# 解决什么需求

- 同一个依赖名称存在不同的版本，同时在浏览器中存在，所以针对 umd 依赖要精确到版本号

# 如何使用

```bash
pnpm genUMDAlias server/libs/react!(*wrap).js
```