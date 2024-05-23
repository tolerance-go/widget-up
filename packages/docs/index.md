# 名词解释

- ModuleInfo
  - npm 模块的信息集合体，包含了很多 path 信息，用 resolveModuleInfo 获取
- ModuleConfig

  - 属性内会出现 PackageConfig
  - npm 模块的配置信息，为 package.json 对象形式

- processXXX
  - 这一系列 api，用来提供外部修改内部数据的机会，一般会注入参数，并且要求返回相应数据
