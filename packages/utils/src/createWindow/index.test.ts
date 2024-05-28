/**
 * @jest-environment jsdom
 */
import { createWindow } from ".";
import { jest } from "@jest/globals";
import { MockInstance } from "jest-mock";

declare global {
  interface Window {
    someNewProperty?: any;
    tempProperty?: any;
  }
}

describe("createWindow", () => {
  let globalWindowSpy: MockInstance<(message?: any) => void> | null = null;

  beforeEach(() => {
    // 在每个测试开始前，监视全局 window 对象的行为
    globalWindowSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    // 测试完成后，恢复原始实现
    globalWindowSpy?.mockRestore();
  });

  it("should create an isolated window proxy", () => {
    const windowProxy = createWindow(window);
    windowProxy.someNewProperty = "test value";

    expect(windowProxy.someNewProperty).toBe("test value");
    expect(window.someNewProperty).toBeUndefined();
  });

  it("should not interfere with global window properties", () => {
    const windowProxy = createWindow(window);
    windowProxy.alert("Hello world");

    expect(globalWindowSpy).toHaveBeenCalled();
  });

  it("should handle property deletion locally", () => {
    const windowProxy = createWindow(window);
    windowProxy.tempProperty = "temporary";
    delete windowProxy.tempProperty;

    expect(windowProxy.tempProperty).toBeUndefined();
    expect("tempProperty" in windowProxy).toBe(false);
    expect(window.tempProperty).toBeUndefined();
  });
});
