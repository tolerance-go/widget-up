import { EventBus } from "@/src/eventBus";
import { ScriptTagManager } from "..";
import { JSDOM } from "jsdom";
import { jest } from "@jest/globals";
import { SpiedFunction } from "jest-mock";
import { TagEvents } from "@/types/htmlDependencyManager";

describe("ScriptTagManager", () => {
  const jsdom = new JSDOM(
    `<!DOCTYPE html><html><head></head><body></body></html>`
  );
  const document = jsdom.window.document;
  const eventBus = new EventBus<TagEvents>();
  let emitSpy: SpiedFunction<InstanceType<typeof EventBus<TagEvents>>["emit"]>;
  let manager: ScriptTagManager;

  beforeEach(() => {
    emitSpy = jest.spyOn(eventBus, "emit");
    manager = new ScriptTagManager({ document, eventBus });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("应按顺序执行随着它们准备好的脚本", () => {
    let jsdom = new JSDOM(
      `<!DOCTYPE html><html><head></head><body></body></html>`
    );

    let document = jsdom.window.document;
    let eventBus = new EventBus();
    let emitSpy = jest.spyOn(eventBus, "emit");
    let manager = new ScriptTagManager({ document, eventBus });

    manager.tags = [
      {
        name: "script1",
        version: "",
        type: "script",
        attributes: {},
        src: "script1.js",
        loaded: true,
        executed: false,
      },
      {
        name: "script2",
        version: "",
        type: "script",
        attributes: {},
        src: "script2.js",
        loaded: true,
        executed: false,
      },
      {
        name: "script3",
        version: "",
        type: "script",
        attributes: {},
        src: "script3.js",
        loaded: false,
        executed: false,
      },
    ];

    // 模拟第三个脚本加载完成
    manager.onTagLoaded("script3.js");
    expect(emitSpy).toHaveBeenCalledWith("execute", { id: "script1.js" });

    // 模拟第一个脚本执行完成
    manager.onTagExecuted("script1.js");
    expect(emitSpy).toHaveBeenCalledWith("execute", { id: "script2.js" });
  });

  it("当脚本加载完成但前一个脚本尚未执行时不应执行当前脚本", () => {
    manager.tags = [
      {
        name: "script1",
        version: "",
        attributes: {},
        type: "script",
        src: "script1.js",
        loaded: true,
        executed: false,
      },
      {
        name: "script2",
        version: "",
        attributes: {},
        type: "script",
        src: "script2.js",
        loaded: true,
        executed: false,
      },
      {
        name: "script3",
        version: "",
        attributes: {},
        type: "script",
        src: "script3.js",
        loaded: false,
        executed: false,
      },
    ];

    // 模拟第三个脚本执行尝试，由于前面的脚本未执行，不应触发执行
    manager.onTagLoaded("script3.js");
    expect(emitSpy).not.toHaveBeenCalledWith("execute", { id: "script3.js" });

    // 模拟第一个脚本执行完成
    manager.onTagExecuted("script1.js");
    expect(emitSpy).toHaveBeenCalledWith("execute", { id: "script2.js" });
  });

  it("没有脚本加载时不应执行任何操作", () => {
    // 确保没有任何标签
    manager.tags = [];
    manager.checkExecute(); // 显式调用检查执行
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
