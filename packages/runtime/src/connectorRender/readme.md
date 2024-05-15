# 是什么

- 被 dev 模块依赖，动态注册渲染函数，注入 root 元素
- ts 编写
- 监听事件“全局组件已更新”，然后重新调用渲染函数

# 解决什么需求

- 根据菜单点击，动态切换渲染组件

# 如何使用

```ts
import React from "react";
import ReactDOM from "react-dom";
import Component from "@widget-up-demo/react16";
import { connectorRender } from "widget-up-runtime";

connectorRender(({ rootElement }) => {
  ReactDOM.render(<Component />, rootElement);
});
```