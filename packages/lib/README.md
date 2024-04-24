# 如何使用

```ts
// 使用示例
interface MyEvents {
  click: { x: number; y: number };
  close: undefined;
}

const bus = new EventBus<MyEvents>();

// 添加监听器
bus.on("click", (payload) => {
  console.log(`Clicked at position (${payload.x}, ${payload.y})`);
});

// 触发 click 事件
bus.emit("click", { x: 100, y: 200 });

// 添加 close 事件的监听器
bus.on("close", () => {
  console.log("Closed event triggered");
});

// 触发 close 事件
bus.emit("close", undefined);
```
