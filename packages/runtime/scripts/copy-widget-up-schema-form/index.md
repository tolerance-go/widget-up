# 是什么

- 一个 ts 的 node 脚本
- ESM 模块

# 解决什么问题

- 它查找当前 cwd 下的 node_modules 中的 widget-up-schema-form 包，解析 browser 和 style 字段，分别表示：
    - browser：umd 入口
    - style：css 样式入口
- 然后复制到 server/libs 下面