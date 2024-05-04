# 是什么

- 用 ts 编写的函数
- 传入 script 脚本内容，可能是 umd 可能是 iife，进行包裹
- 在最外层他使用全局 EventBus 对象进行监听和派发事件

# 解决什么需求

- 网页的动态 script 无法同时解决并行下载和按需执行的问题，通过包裹 script 内容，他在下载完毕后发送事件，并同时监听执行事件，通过事件机制来解决

# 如何使用

```ts
import { wrapUMDAsyncEventCode } from '...'

const newScriptContent = wrapUMDAsyncEventCode({
    scriptContent: '...'
})
```