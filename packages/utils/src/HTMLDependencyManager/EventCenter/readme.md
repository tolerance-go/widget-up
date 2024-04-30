# 是什么

- 一个 ts 编写的类
- 内部维护一个事件中心，来接受和派发事件
- 他每次都从 HTMLDependencyManager 接收到更新 diff，通过 calculateDiffs 返回，然后根据 diff 去维护内部的 tags 列表包括其加载状态，然后在适当的时候发送事件
- tags 的依赖顺序是从前到后的，后面的依赖前面的，保证一个 tag 执行的时候，排在前面的所有 tag 都已经执行过了

# 解决什么需求


- 页面上的一组 script 标签，他们都是 async 的，希望可以通过代码来控制执行顺序
    - 这些 script 标签的内容都包裹了一层代码，他在下载完毕后发送事件，并同时监听执行事件，通过事件机制来解决

- 内部维护事件中心，来做整体的调度

# 如何使用

```ts
const eventCenter = new EventCenter();

eventCenter.applyDiffs(diffs)
```