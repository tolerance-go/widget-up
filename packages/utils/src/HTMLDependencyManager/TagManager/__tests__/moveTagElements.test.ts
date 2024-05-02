import { JSDOM } from "jsdom";
import { ScriptTagManager } from "..";
import { DependencyListInsertionDetail } from "../../types";
import { formatHeadHtml } from "@/__tests__/_utils";

describe("TagManager", () => {
  let tagManager: ScriptTagManager;
  let mockDocument: Document;
  let head: HTMLHeadElement;

  beforeEach(() => {
    // 创建模拟的 document 和 head
    mockDocument = new JSDOM(
      "<!DOCTYPE html><html><head></head><body></body></html>"
    ).window.document;
    head = mockDocument.head;
    // 实例化 TagManager
    tagManager = new ScriptTagManager({ document: mockDocument });
  });

  it("should move an existing tag to a new position based on prevSrc", () => {
    // 添加初始标签到 head 中
    const script1 = mockDocument.createElement("script");
    script1.src = "script1.js";
    head.appendChild(script1);

    const script2 = mockDocument.createElement("script");
    script2.src = "script2.js";
    head.appendChild(script2);

    const moveDetail: DependencyListInsertionDetail = {
      dep: { src: "script2.js", type: "script", attributes: {} },
      prevDep: null, // 将 script2 移动到第一个位置
    };

    // 模拟移动操作
    tagManager.syncHtml({
      insert: [],
      move: [moveDetail],
      remove: [],
      update: [],
    });

    // 检查 script2 是否被正确移动到第一个位置
    expect(formatHeadHtml(mockDocument)).toMatchInlineSnapshot(`
      "<script src="script2.js"></script>
      <script src="script1.js"></script>"
    `);
  });
});
