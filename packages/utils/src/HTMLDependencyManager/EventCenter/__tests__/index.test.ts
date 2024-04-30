import { EventBus } from "@/src/EventBus";
import { TagEvents, TagManager } from "..";
import { TagDiff } from "../../types";

describe("TagManager", () => {
  let eventBus: EventBus<TagEvents>;
  let tagManager: TagManager;

  beforeEach(() => {
    eventBus = new EventBus<TagEvents>();
    tagManager = new TagManager(eventBus);
  });

  it("should handle insertion correctly", () => {
    const diffs: TagDiff = {
      insert: [
        {
          tag: { type: "script", src: "script1.js", attributes: {} },
          prevSrc: null,
        },
      ],
      remove: [],
      update: [],
    };

    tagManager.applyDiffs(diffs);
    expect(tagManager["tags"]).toHaveLength(1);
    expect(tagManager.getTags()).toMatchInlineSnapshot(`
      [
        {
          "attributes": {},
          "executed": false,
          "loaded": false,
          "src": "script1.js",
          "type": "script",
        },
      ]
    `);
    expect(tagManager["tags"][0].src).toEqual("script1.js");
  });

  it("should handle removal correctly", () => {
    // 先插入一个标签，然后移除
    tagManager.applyDiffs({
      insert: [
        {
          tag: { type: "script", src: "script1.js", attributes: {} },
          prevSrc: null,
        },
      ],
      remove: [],
      update: [],
    });
    tagManager.applyDiffs({
      insert: [],
      remove: [{ type: "script", src: "script1.js", attributes: {} }],
      update: [],
    });
    expect(tagManager.getTags()).toMatchInlineSnapshot(`[]`);
    expect(tagManager["tags"]).toHaveLength(0);
  });

  it("should handle updates correctly", () => {
    // 先插入，再更新
    tagManager.applyDiffs({
      insert: [
        {
          tag: { type: "script", src: "script1.js", attributes: {} },
          prevSrc: null,
        },
      ],
      remove: [],
      update: [],
    });
    tagManager.applyDiffs({
      insert: [],
      remove: [],
      update: [
        { type: "script", src: "script1.js", attributes: { async: "true" } },
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
          "src": "script1.js",
          "type": "script",
        },
      ]
    `);
    expect(tagManager["tags"][0].attributes.async).toEqual("true");
  });

  it("should maintain execution order across multiple inserts", () => {
    // 插入多个依次依赖的标签
    tagManager.applyDiffs({
      insert: [
        {
          tag: { type: "script", src: "script1.js", attributes: {} },
          prevSrc: null,
        },
        {
          tag: { type: "script", src: "script2.js", attributes: {} },
          prevSrc: "script1.js",
        },
      ],
      remove: [],
      update: [],
    });
    tagManager.applyDiffs({
      insert: [
        {
          tag: { type: "script", src: "script3.js", attributes: {} },
          prevSrc: "script2.js",
        },
      ],
      remove: [],
      update: [],
    });
    tagManager.applyDiffs({
      insert: [
        {
          tag: { type: "script", src: "script2.1.js", attributes: {} },
          prevSrc: "script2.js",
        },
      ],
      remove: [],
      update: [],
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
          "src": "script2.1.js",
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
  });
});
