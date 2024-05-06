# 是什么

- 根据 demoMenus 数组生成 rollup 的入口配置
- 会打平嵌套结构，生成一个扁平的 list

# 解决什么需求

- 开发的时候，把 demo 里面的文件作为入口，构建到 dist/server/demos 里面

怎么用

```ts
import { getDemoInputList } from "widget-up";

const demoInputs = getDemoInputList({...});
```
