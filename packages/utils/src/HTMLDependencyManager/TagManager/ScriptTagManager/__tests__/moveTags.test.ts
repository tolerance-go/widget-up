import { EventBus } from "@/src/eventBus";
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
          dep: {
            name: "script1.js",
            version: {
              exact: "",
              range: "",
            },
          },
          prevDep: null,
        },
        {
          dep: {
            name: "script2.js",
            version: {
              exact: "",
              range: "",
            },
          },
          prevDep: {
            name: "script1.js",
            version: {
              exact: "",
              range: "",
            },
          },
        },
        {
          dep: {
            name: "script3.js",
            version: {
              exact: "",
              range: "",
            },
          },
          prevDep: {
            name: "script2.js",
            version: {
              exact: "",
              range: "",
            },
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
          "attributes": {
            "async": "true",
          },
          "executed": false,
          "loaded": false,
          "name": "script1.js",
          "src": "script1.js@.js",
          "type": "script",
          "version": "",
        },
        {
          "attributes": {
            "async": "true",
          },
          "executed": false,
          "loaded": false,
          "name": "script2.js",
          "src": "script2.js@.js",
          "type": "script",
          "version": "",
        },
        {
          "attributes": {
            "async": "true",
          },
          "executed": false,
          "loaded": false,
          "name": "script3.js",
          "src": "script3.js@.js",
          "type": "script",
          "version": "",
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
          dep: {
            name: "script2.js",
            version: {
              exact: "",
              range: "",
            },
          },
          prevDep: {
            name: "script3.js",
            version: {
              exact: "",
              range: "",
            },
          },
        },
      ],
    });

    expect(tagManager.getTags()).toMatchInlineSnapshot(`
      [
        {
          "attributes": {
            "async": "true",
          },
          "executed": false,
          "loaded": false,
          "name": "script1.js",
          "src": "script1.js@.js",
          "type": "script",
          "version": "",
        },
        {
          "attributes": {
            "async": "true",
          },
          "executed": false,
          "loaded": false,
          "name": "script3.js",
          "src": "script3.js@.js",
          "type": "script",
          "version": "",
        },
        {
          "attributes": {
            "async": "true",
          },
          "executed": false,
          "loaded": false,
          "name": "script2.js",
          "src": "script2.js@.js",
          "type": "script",
          "version": "",
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
          dep: {
            name: "script3.js",
            version: {
              exact: "",
              range: "",
            },
          },
          prevDep: null,
        },
      ],
    });

    expect(tagManager.getTags()).toMatchInlineSnapshot(`
      [
        {
          "attributes": {
            "async": "true",
          },
          "executed": false,
          "loaded": false,
          "name": "script3.js",
          "src": "script3.js@.js",
          "type": "script",
          "version": "",
        },
        {
          "attributes": {
            "async": "true",
          },
          "executed": false,
          "loaded": false,
          "name": "script1.js",
          "src": "script1.js@.js",
          "type": "script",
          "version": "",
        },
        {
          "attributes": {
            "async": "true",
          },
          "executed": false,
          "loaded": false,
          "name": "script2.js",
          "src": "script2.js@.js",
          "type": "script",
          "version": "",
        },
      ]
    `);
  });
});
