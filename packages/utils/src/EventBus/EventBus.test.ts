import { EventBus } from ".";
import { jest } from "@jest/globals";

interface TestEvents {
  increment: number;
  decrement: number;
}

describe("EventBus", () => {
  let bus: EventBus<TestEvents>;

  beforeEach(() => {
    bus = new EventBus<TestEvents>();
  });

  test("should trigger increment event with correct payload", () => {
    const mockListener = jest.fn();
    bus.on("increment", mockListener);

    bus.emit("increment", 1);
    expect(mockListener).toHaveBeenCalledWith(1);
  });

  test("should trigger decrement event and respond to multiple listeners", () => {
    const firstListener = jest.fn();
    const secondListener = jest.fn();

    bus.on("decrement", firstListener);
    bus.on("decrement", secondListener);

    bus.emit("decrement", -1);
    expect(firstListener).toHaveBeenCalledWith(-1);
    expect(secondListener).toHaveBeenCalledWith(-1);
  });

  test("should remove listener correctly", () => {
    const listener = jest.fn();
    bus.on("decrement", listener);
    bus.emit("decrement", -1);
    expect(listener).toHaveBeenCalledTimes(1);

    bus.off("decrement", listener);
    bus.emit("decrement", -1);
    expect(listener).toHaveBeenCalledTimes(1); // 确保移除后不再调用
  });

  test("should immediately trigger listener if event already emitted", () => {
    const mockListener = jest.fn();

    bus.emit("increment", 1);
    bus.on("increment", mockListener, { immediate: true });

    expect(mockListener).toHaveBeenCalledWith(1);
  });

  test("should not trigger listener immediately if event not emitted", () => {
    const mockListener = jest.fn();

    bus.on("increment", mockListener, { immediate: true });

    expect(mockListener).not.toHaveBeenCalled();
  });

  test("should only trigger listener once if event emitted and then registered with immediate option", () => {
    const mockListener = jest.fn();

    bus.emit("increment", 1);
    bus.on("increment", mockListener, { immediate: true });

    expect(mockListener).toHaveBeenCalledTimes(1);
    expect(mockListener).toHaveBeenCalledWith(1);

    bus.emit("increment", 2);
    expect(mockListener).toHaveBeenCalledTimes(2);
    expect(mockListener).toHaveBeenCalledWith(2);
  });
});
