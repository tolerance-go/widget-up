# 是什么

- 一个 ts 编写的方法
- 他创建一个新的 window 对象，可以像使用浏览器全局的基本一样使用它
    - 但是对他的 set，不会污染全局的 window 对象

# 解决什么需求

- 一些 umd 的包依赖全局 window，但是不同的 umd 的包我希望可以保证依赖的隔离

# 如何使用

```ts
import { createWindow } from './...'

const windowProxy = createWindow(window);
```