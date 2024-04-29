# 是什么

- 一个 ts 函数
- 用来渲染开发预览页面的大框架，左右中间区域都设置了对应 id
- 用 jquery 开发
- 样式用 tailwindcss 设计样式

# 解决什么问题

- 渲染框架，解决后续 jquery 插入节点的问题

# 如果使用

```ts
import { renderFrame } from './renderFrame'

renderFrame();
```