import { EventBus } from "@/src/EventBus";
import { TagEvents, TagManager } from "../..";
import { JSDOM } from "jsdom";
import { ScriptTagManager } from "..";

describe("ScriptTagManager moveTags", () => {
  let eventBus: EventBus<TagEvents>;
  let tagManager: ScriptTagManager;
  let mockDocument: Document;
  let head: HTMLHeadElement;

  beforeEach(() => {
    eventBus = new EventBus<TagEvents>();
    mockDocument = new JSDOM(
      "<!DOCTYPE html><html><head></head><body></body></html>"
    ).window.document;
    head = mockDocument.head;
    tagManager = new ScriptTagManager({
      eventBus,
      document: mockDocument,
      container: head,
    });
  });

  it("should handle tag movements correctly", () => {
    // 先插入几个标签
    tagManager.applyDependencyDiffs({
      insert: [
        {
          dep: { name: "script1.js", version: "" },
          prevDep: null,
        },
        {
          dep: { name: "script2.js", version: "" },
          prevDep: {
            name: "script1.js",
            version: "",
          },
        },
        {
          dep: { name: "script3.js", version: "" },
          prevDep: {
            name: "script2.js",
            version: "",
          },
        },
      ],
      remove: [],
      update: [],
      move: [],
    });

    expect(tagManager.getTags()).toMatchInlineSnapshot(`
      [
        {
          "attributes": {},
          "executed": false,
          "loaded": false,
          "src": "script1.js",
          "type": "script",
        },
        {
          "attributes": {},
          "executed": false,
          "loaded": false,
          "src": "script2.js",
          "type": "script",
        },
        {
          "attributes": {},
          "executed": false,
          "loaded": false,
          "src": "script3.js",
          "type": "script",
        },
      ]
    `);

    // 移动 script2.js 到 script3.js 之后
    tagManager.applyDependencyDiffs({
      insert: [],
      remove: [],
      update: [],
      move: [
        {
          dep: { name: "script2.js", version: "" },
          prevDep: { name: "script3.js", version: "" },
        },
      ],
    });

    expect(tagManager.getTags()).toMatchInlineSnapshot(`
      [
        {
          "attributes": {},
          "executed": false,
          "loaded": false,
          "src": "script1.js",
          "type": "script",
        },
        {
          "attributes": {},
          "executed": false,
          "loaded": false,
          "src": "script3.js",
          "type": "script",
        },
        {
          "attributes": {},
          "executed": false,
          "loaded": false,
          "src": "script2.js",
          "type": "script",
        },
      ]
    `);

    // 移动 script3.js 到列表开始位置
    tagManager.applyDependencyDiffs({
      insert: [],
      remove: [],
      update: [],
      move: [
        {
          dep: { name: "script3.js", version: "" },
          prevDep: null,
        },
      ],
    });

    expect(tagManager.getTags()).toMatchInlineSnapshot(`
      [
        {
          "attributes": {},
          "executed": false,
          "loaded": false,
          "src": "script3.js",
          "type": "script",
        },
        {
          "attributes": {},
          "executed": false,
          "loaded": false,
          "src": "script1.js",
          "type": "script",
        },
        {
          "attributes": {},
          "executed": false,
          "loaded": false,
          "src": "script2.js",
          "type": "script",
        },
      ]
    `);
  });
});
