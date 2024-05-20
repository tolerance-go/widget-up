# 注意事项：

- 默认不打 cjs 包
- umd 的 external 需要指定，cjs 和 esm 默认将 dependencies 和 peerDependencies 视为 external


这个包作为基础依赖（设计为被其他包依赖，所以用 babel 打包，因为不需要用 rollup 的 tree-shaking 特效）