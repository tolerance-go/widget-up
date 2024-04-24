- [] widget-up 增加一个 mode，支持打包组件和 lib
  - [] 替换模块内的 lib 打包工具
- [] 新增一个 rollup 插件，它读取根目录下的 tsconfig 的 paths 然后设置 alias
- [] Config 类型改为 SchemaConfig，约定如果带 Schema 的，表示只允许出现静态类型

开发时候，生成 index.js 使用 umd 的 包

- 入口文件还是用用户定义的，不再替换
- runtimeHtmlPlugin 新增一个 生成 index.js 的逻辑
- 模板里面加上 引入
- 这样入口文件 ejs 也不用渲染了，直接写 tsx 或者 ts 文件
