# 是什么

- 一个 ts 函数
- 用来渲染菜单
- 元素 dom 开发
- 样式用 tailwindcss 设计样式

# 解决什么需求

- 它可以请求当前服务器下的 /menus.json 数据，然后进行递归的菜单渲染

# 如果使用

- containerId 是网页的元素 id

```ts
import { renderMenus } from './renderMenus'

renderMenus({ containerId: '...' });
```