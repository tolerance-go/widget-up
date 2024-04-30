import { wrapScriptAndWaitExec } from ".";

describe("wrapScriptAndWaitExec", () => {
  const scriptContent = "console.log('Hello World');";
  const eventName = "testEvent";

  it("should wrap a script and handle global object dynamically", () => {
    const mockEnv = {
      EventBus: {
        on: jest.fn(),
        emit: jest.fn(),
      },
    };

    const wrappedScript = wrapScriptAndWaitExec({
      scriptContent,
      eventName,
      eventBusPath: "EventBus",
      globalObjectVarName: "mockEnv",
    });

    eval(wrappedScript);

    expect(mockEnv.EventBus.on).toHaveBeenCalledWith(
      `${eventName}-execute`,
      expect.any(Function)
    );
    expect(mockEnv.EventBus.emit).toHaveBeenCalledWith(`${eventName}-ready`);
  });

  it("should not execute script if event is not emitted", () => {
    const mockEnv = {
      EventBus: {
        on: jest.fn(),
        emit: jest.fn(),
      },
    };

    const wrappedScript = wrapScriptAndWaitExec({
      scriptContent,
      eventName,
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

    const wrappedScript = wrapScriptAndWaitExec({
      scriptContent,
      eventName,
      eventBusPath: "NonExistent.EventBus",
      globalObjectVarName: "mockEnv",
    });

    expect(() => eval(wrappedScript)).toThrow();
  });

  it("should confirm script execution effects", () => {
    const mockEnv = {
      EventBus: {
        on: (event: string, callback: () => void) => callback(),
        emit: jest.fn(),
      },
    };

    console.log = jest.fn(); // 重新模拟 console.log
    const wrappedScript = wrapScriptAndWaitExec({
      scriptContent,
      eventName,
      eventBusPath: "EventBus",
      globalObjectVarName: "mockEnv",
    });

    eval(wrappedScript);

    // 检查 console.log 是否因脚本执行而被调用
    expect(console.log).toHaveBeenCalledWith("Hello World");
  });
});
