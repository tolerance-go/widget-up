# 是什么

- 命令行工具
- 用 ts 编写
- eventId 默认用 file 的文件名

# 解决什么需求

- 通过命令行调用 wrapUMDAsyncEventCode，读取文件，然后写入文件并重新命名，增加一个后缀 .wrap
- 函数参数可以通过命令行传递

# 如何使用

```bash
pnpm wrapUMDAsyncEventCode 'server/libs/!(*wrap).js' --eventBusPath EventBus --eventId comp.react16
```
