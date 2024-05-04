import { wrapUMDAsyncEventCode } from ".";

describe("wrapUMDAsyncEventCode", () => {
  const scriptContent = "console.log('Hello World');";
  const eventId = "testEvent";

  it("should wrap a script and handle global object dynamically", () => {
    const mockEnv = {
      EventBus: {
        on: jest.fn((event, handler) => {
          if (event === "execute") {
            // 直接触发回调以模拟事件，确保逻辑对于全局对象的处理正确
            handler({ id: eventId });
          }
        }),
        emit: jest.fn(),
      },
    };

    console.log = jest.fn(); // 重新模拟 console.log
    const wrappedScript = wrapUMDAsyncEventCode({
      scriptContent,
      eventId,
      eventBusPath: "EventBus",
      globalObjectVarName: "mockEnv",
    });

    eval(wrappedScript);

    // 验证是否为 execute 事件注册了正确的回调函数
    expect(mockEnv.EventBus.on).toHaveBeenCalledWith(
      "execute",
      expect.any(Function)
    );

    // 检查脚本是否触发了 ready 事件，并传递正确的 id
    expect(mockEnv.EventBus.emit).toHaveBeenCalledWith("loaded", {
      id: eventId,
    });

    // 如果事件处理正确，我们还应检查脚本内容是否被执行
    expect(console.log).toHaveBeenCalledWith("Hello World");
  });

  it("should not execute script if event is not emitted", () => {
    const mockEnv = {
      EventBus: {
        on: jest.fn(),
        emit: jest.fn(),
      },
    };

    const wrappedScript = wrapUMDAsyncEventCode({
      scriptContent,
      eventId,
      eventBusPath: "EventBus",
      globalObjectVarName: "mockEnv",
    });

    console.log = jest.fn(); // 重新模拟 console.log
    eval(wrappedScript);
    // 模拟不触发事件
    expect(console.log).not.toHaveBeenCalled();
  });

  it("should handle non-existent EventBus path gracefully", () => {
    const mockEnv = {}; // 没有 EventBus 对象

    const wrappedScript = wrapUMDAsyncEventCode({
      scriptContent,
      eventId,
      eventBusPath: "NonExistent.EventBus",
      globalObjectVarName: "mockEnv",
    });

    expect(() => eval(wrappedScript)).toThrow();
  });

  it("should confirm script execution effects", () => {
    const mockEnv = {
      EventBus: {
        on: (event: string, callback: (item: { id: string }) => void) =>
          callback({ id: eventId }),
        emit: jest.fn(),
      },
    };

    console.log = jest.fn(); // 重新模拟 console.log
    const wrappedScript = wrapUMDAsyncEventCode({
      scriptContent,
      eventId,
      eventBusPath: "EventBus",
      globalObjectVarName: "mockEnv",
    });

    eval(wrappedScript);

    // 检查 console.log 是否因脚本执行而被调用
    expect(console.log).toHaveBeenCalledWith("Hello World");
  });
});
