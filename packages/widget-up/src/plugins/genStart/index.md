# 是什么

- 一个 ts 编写的方法
- 是一个 rollup 插件
- 它内部使用 PeerDependTreeManager，监听他的改变
- 一个 start.js 文件内容长这样
    - 最前面都是 inputXXX 的依赖

```js
WidgetUpRuntime.start({
  dependencies: [
    {
      name: "widget-up-connector-react16",
      version: "0.0.0",
      scriptSrc: () => "/libs/input.react16.alias-wrap.async-wrap.js",
      depends: [
        {
          name: "@widget-up-demo/react16",
          version: "0.0.0",
          scriptSrc: () => "/demos/comp.react16.alias-wrap.async-wrap.js",
          depends: [
            {
              name: "react-dom",
              version: "16.14.0",
              scriptSrc: (dep) =>
                `/libs/react-dom.development.alias-wrap.async-wrap.js`,
              depends: [
                {
                  name: "react",
                  version: "16.14.0",
                  scriptSrc: (dep) =>
                    `/libs/react.development.alias-wrap.async-wrap.js`,
                },
              ],
            },
            {
              name: "react",
              version: "16.14.0",
              scriptSrc: (dep) =>
                `/libs/react.development.alias-wrap.async-wrap.js`,
            },
          ],
        },
        {
          name: "@widget-up-demo/react16-2",
          version: "0.0.0",
          scriptSrc: () => "/demos/comp.react16-2.alias-wrap.async-wrap.js",
          depends: [
            {
              name: "react-dom",
              version: "16.14.0",
              scriptSrc: (dep) =>
                `/libs/react-dom.development.alias-wrap.async-wrap.js`,
              depends: [
                {
                  name: "react",
                  version: "16.14.0",
                  scriptSrc: (dep) =>
                    `/libs/react.development.alias-wrap.async-wrap.js`,
                },
              ],
            },
            {
              name: "react",
              version: "16.14.0",
              scriptSrc: (dep) =>
                `/libs/react.development.alias-wrap.async-wrap.js`,
            },
          ],
        },
      ],
    },
    {
      name: "widget-up-connector-react18",
      version: "0.0.0",
      scriptSrc: () => "/libs/input.react18.alias-wrap.async-wrap.js",
      depends: [
        {
          name: "@widget-up-demo/react18",
          version: "0.0.0",
          scriptSrc: () => "/demos/comp.react18.alias-wrap.async-wrap.js",
          depends: [
            {
              name: "react-dom",
              version: "18.2.0",
              scriptSrc: (dep) =>
                `/libs/react-dom18.development.alias-wrap.async-wrap.js`,
              depends: [
                {
                  name: "react",
                  version: "16.14.0",
                  scriptSrc: (dep) =>
                    `/libs/react.development.alias-wrap.async-wrap.js`,
                },
              ],
            },
            {
              name: "react",
              version: "18.2.0",
              scriptSrc: (dep) =>
                `/libs/react18.development.alias-wrap.async-wrap.js`,
            },
          ],
        },
      ],
    },
  ],
});
```

# 解决什么需求

- 他在 rollup 运行的开始，生成一个 start.js

# 如何使用

```ts
import { genStart } from '...';

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "esm",
  },
  plugins: [
   genStart({
    ...
   })
  ], 
  watch: {
    include: "src/**", 
  },
};
```