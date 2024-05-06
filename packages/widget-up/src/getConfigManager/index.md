# 是什么

- 一个 ts 编写的类
- 他返回解析后的 config 对象
- 他还可以注册监听，当 config 变化的时候触发


# 解决什么需求

- server libs 需要监听配置变化动态生成

# 如何使用

```ts
import getConfig from '...'

const config = getConfig();

config.get();

const unwatch = config.watch(() => {

})

unwatch();
```