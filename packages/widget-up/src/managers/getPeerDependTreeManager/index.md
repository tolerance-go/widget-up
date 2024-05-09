# 是什么

- 这是一个 ts 编写的类
- 它监听 package.json 的变化动态维护内部的前置依赖树，触发改变事件
- 它可以注册监听的回调，监听前置依赖树的改变
- 它可以 get 当前的依赖树数据
- 它继承 EventEmitter

# 解决什么需求

- 我需要解析当前 npm 的前置依赖的树到内存，并且监听文件的改变维护它，提供给程序使用

# 如何使用

```ts
import { getPeerDependTreeManager } from ''


const peerDependTreeManager = getPeerDependTreeManager()
```