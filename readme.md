开发时候，生成 index.js 使用 umd 的 包

- 入口文件还是用用户定义的，不再替换
- runtimeHtmlPlugin 新增一个 生成 index.js 的逻辑
- 模板里面加上 引入
- 这样入口文件 ejs 也不用渲染了，直接写 tsx 或者 ts 文件
