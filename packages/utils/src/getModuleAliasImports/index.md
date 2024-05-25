我需要把一个模块的 script 包裹
他的配置中的 external 和 globals 加上他模块的前置依赖的 package.json 配置信息可以帮助来设置脚本的 imports

# 约定

- 一个 umd 脚本对外暴露的变量是 globalName_versionId 格式

那我现在需要一个方法

他负责把一个包进行 alias imports 包裹，他接受这个包的配置信息
