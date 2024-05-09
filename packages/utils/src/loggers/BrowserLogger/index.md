# 是什么

- 一个 ts 编写的类

# 解决的问题

- 浏览器打印日志管理

# 如何使用

```ts
// 使用示例
const baseLogger = new BrowserLogger('App');
baseLogger.info('初始化应用');

const moduleLogger = baseLogger.extendNamespace('Module');
moduleLogger.warn('模块加载警告');

const componentLogger = moduleLogger.extendNamespace('Component');
componentLogger.error('组件错误');
```