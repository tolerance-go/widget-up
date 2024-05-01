import { EventBus } from "@/src/EventBus";
import { TagEvents, TagManager } from "..";

describe("TagManager moveTags", () => {
  let eventBus: EventBus<TagEvents>;
  let tagManager: TagManager;

  beforeEach(() => {
    eventBus = new EventBus<TagEvents>();
    tagManager = new TagManager({ eventBus });
  });

  it("should handle tag movements correctly", () => {
    // 先插入几个标签
    tagManager.applyDependencyDiffs({
      insert: [
        {
          tag: { type: "script", src: "script1.js", attributes: {} },
          prevSrc: null,
        },
        {
          tag: { type: "script", src: "script2.js", attributes: {} },
          prevSrc: "script1.js",
        },
        {
          tag: { type: "script", src: "script3.js", attributes: {} },
          prevSrc: "script2.js",
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
          tag: { type: "script", src: "script2.js", attributes: {} },
          prevSrc: "script3.js",
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
          tag: { type: "script", src: "script3.js", attributes: {} },
          prevSrc: null,
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
