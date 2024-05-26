import { JSDOM } from "jsdom";
import {
  HTMLDependencyListInsertionDetail,
  ScriptTag,
  TagListInsertionDetail,
} from "../../../../../types/htmlDependencyManager";
import { formatHeadHtml } from "@/__tests__/_utils";
import { ScriptTagManager } from "..";

describe("ScriptTagManager moveTagElements", () => {
  let manager: ScriptTagManager;
  let mockDocument: Document;
  let head: HTMLHeadElement;

  beforeEach(() => {
    // 创建模拟的 document 和 head
    mockDocument = new JSDOM(
      "<!DOCTYPE html><html><head></head><body></body></html>"
    ).window.document;
    head = mockDocument.head;
    // 实例化 TagManager
    manager = new ScriptTagManager({ document: mockDocument, container: head });
  });

  it("should move an existing tag to a new position based on prevSrc", () => {
    // 添加初始标签到 head 中
    const script1 = mockDocument.createElement("script");
    script1.src = "script1.js";
    head.appendChild(script1);

    const script2 = mockDocument.createElement("script");
    script2.src = "script2.js";
    head.appendChild(script2);

    const moveDetail: TagListInsertionDetail<ScriptTag> = {
      tag: {
        type: "script",
        src: "script2.js",
        attributes: {},
        name: "script2",
        version: "",
      },
      prevTag: null, // 将 script2 移动到第一个位置
    };

    // 模拟移动操作
    manager.updateHtml({
      insert: [],
      move: [moveDetail],
      remove: [],
      update: [],
    });

    // 这里不会进行移动，因为不是内部创建的，没有加上 tag
    expect(formatHeadHtml(mockDocument)).toMatchInlineSnapshot(`
      "<script src="script1.js"></script>
      <script src="script2.js"></script>"
    `);
  });
});
