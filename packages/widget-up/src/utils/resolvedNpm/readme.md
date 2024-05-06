# 是什么

- 一个 ts 函数
- 动态找到运行时最近的 npm 包

# 解决什么需求

- 通过名称找到当前依赖的实际 npm 包和版本号

# 如何使用

```ts
import { resolvedNpm } from '...'

const {
    modulePath,
    ...
} = resolvedNpm({
    name: 'react'
})
```
