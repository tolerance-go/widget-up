# 是什么

- 一个 ts 编写的 rollup 插件
- 他根据 umd 的配置，找到运行环境中的 包，然后把他们复制到 dist/server/libs 下面
    - 根据环境变量复制，如果当前 buildEnv 是 development 就用 development 的 path
    - 暴露一个接口，在复制之前可以修改代码的 code 内容

# 解决什么需求

- 解析 umd 配置，把外部依赖从 node_modules 中复制出来，并且包装后，复制到 server 下


# 如何使用

```ts
import getServerLibsPlgs from '..'

getServerLibsPlgs({
    umdConfig,
    ...
})
```