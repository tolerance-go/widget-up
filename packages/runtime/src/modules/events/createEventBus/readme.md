# 是什么

- ts 编写的方法
- 创建一个 eventBus
- 预设定义好一些事件，包括点击菜单事件

# 解决什么需求

- 驱动预览框架页面的交互

# 如何使用

```ts
import { createEventBus } from './createEventBus'

const eventBus = createEventBus();
```

## 依赖

- EventBus

