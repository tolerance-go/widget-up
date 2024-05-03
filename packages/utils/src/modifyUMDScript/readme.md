# 是什么

- 一个 ts 函数
- 他把代码封装在一个函数作用域中
- 他把外部的环境中的依赖手动 pick 到函数作用域自定义全局对象中
- 同时把自定义对象中暴露的接口，再手动暴露出来

# 解决什么需求

- 保证 umd 不同版本之间不会污染全局对象

# 如何使用

```ts
import { modifyUMDScript } from "./modifyUMDScript";

modifyUMDScript({
  originalScriptContent: "",
  imports: [
    {
      globalVar: "React",
      scopeVar: "React",
    },
    {
      globalVar: "ReactDOM",
      scopeVar: "ReactDOM",
    },
  ],
  exports: {
    scopeVar: "Component",
    globalVar: "Component_new",
  },
});
```
