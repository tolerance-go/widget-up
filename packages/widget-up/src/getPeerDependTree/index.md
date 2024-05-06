# 是什么

- 一个 ts 编写的方法
- 它从 cwd 开始解析，读取 package.json，找到 peerDependencies ，并继续处理前置依赖的前置依赖，解析为一个树形数据结构返回

# 解决什么需求

- 为了构建 start.js 做准备
- 为了构建 server/libs 做准备

# 如何使用

```ts
import getPeerDependTree from './getPeerDependTree'

const data = getPeerDependTree({
    cwd,
})
```