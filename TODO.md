# 2024/5/23

- [] 类型合并为一个单独文件定义，方便重构和设计
- [x] 启动的时候，如果 demos 文件夹不存在不报错
- [x] Cannot read properties of undefined (reading 'browser')
- [x] [!] (plugin server-libs-plugin) Error: Module 'widget-up-schema-form' not found in any 'node_modules' directory from current path. 
- [] 前置依赖树类型底层可以调用 resolveModuleInfo
- [x] 生成的 start.js 脚本格式不对
- [] libs 中没有 jquery 包
- [] 考虑去除所有 version 的 range
- [] 优化 resolveModuleInfo

# 2024/5/19

- schema-form
  - [x] 和 widget-up 解耦，因为互相依赖了
- widget-up
  - [] runtime rollup 去除，使用多配置和 schema-form 同步修改，并且这样减少程序 api 带来的复杂性

# 2024/5/17

- runtime
  - [x] 配置传入右侧表单
- widget-up
  - [x] packageConfig 改名为 package.json
  - [x] widget-up-runtime 改名为 runtime.js

# 2024/5/16

- [x] 生成 json 资源到 assets 文件夹中

# 2024 年 5 月 11 日

- [x] 依赖中有额外的 css 文件，需要在配置里面加一个判断检查
- [x] 本地开发，获取依赖资源报错 404

  - [x] lib 请求地址和资源地址名称不一样
    - why
      - 请求的路径追加了 index.js，资源没有
  - [x] 请求 demo 的 url 地址和资源不一样
  - [x] input 请求地址 404 了
  - [x] inputs 下的代码请求地址错了

- [x] 修改源码后，刷新页面
- [x] 点击菜单后，同步修改浏览器 url

# 2024-5-6

wup 开发模式可以像 runtime 一样运行

- [] runtimeRollup 插件支持 bundle 写入前的修改插件
