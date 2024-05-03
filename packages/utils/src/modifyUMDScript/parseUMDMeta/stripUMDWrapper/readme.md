# 是什么

- 一个函数，ts 写的
- 他把 umd 的代码的注入全局对象和 factory 都删除，只留下开头的执行函数

# 解决什么需求

- 为动态获取 umd 依赖和输出做准备

# 如何使用

```ts
import { stripUMDWrapper } from './stripUMDWrapper'

stripUMDWrapper({
    scriptContent: `
    (function (global, factory) {
      typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
      typeof define === 'function' && define.amd ? define(['exports'], factory) :
      (global = global || self, factory(global.React = {}));
    }(this, (function (exports) { 'use strict';
        console.log('react-dom16.js')
    })));
`
})

=> 

`
    function (global, factory) {
      typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
      typeof define === 'function' && define.amd ? define(['exports'], factory) :
      (global = global || self, factory(global.React = {}));
    }
`
```