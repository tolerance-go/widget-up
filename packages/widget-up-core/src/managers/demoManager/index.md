# 是什么

- 一个 ts 编写的类
- 它负责维护 cwd 下 demos 文件夹的内部文件结构数据的内存管理
- 它继承自 EventEmitter，可以注册对数据改变的监听

# 解决什么需求

- 给程序使用 demos 文件夹数据的能力

# 如何使用

```ts
import getDemosManager from './getDemosManager'

const demosFolderManager = getDemosManager();
```