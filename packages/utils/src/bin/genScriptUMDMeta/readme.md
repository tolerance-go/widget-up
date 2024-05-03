# 是什么

- 一个 ts 编写的 bin 文件
- 命令行执行
- 输入当前 cwd 下的 glob，进行匹配文件，然后对其进行 UMD meta 的生成
    - 成功的话，会生成同名文件的 xxx.umd-meta.json 文件
        - 注意如果已经有了同名文件，就不生成了，而是提示用户，如果要生成，手动删除后再次运行
    - 内部用的是 parseUMDMeta 方法

# 解决什么需求

- 方便肉眼去看 umd 的依赖和输出是什么
- 为生成包裹的 script 提供预制的信息

# 如何使用

```bash
pnpm genScriptUMDMeta '{server/libs/react*.js,!server/libs/*wrap.js}'
```