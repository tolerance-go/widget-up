import { EventBus } from "@/src/EventBus";
import { TagEvents, TagManager } from "../..";
import { DependencyListDiff } from "../../../types";
import { JSDOM } from "jsdom";
import { ScriptTagManager } from "..";

describe("ScriptTagManager", () => {
  let eventBus: EventBus<TagEvents>;
  let manager: ScriptTagManager;

  beforeEach(() => {
    const jsdom = new JSDOM(`<!DOCTYPE html>`);
    eventBus = new EventBus<TagEvents>();
    manager = new ScriptTagManager({
      eventBus,
      document: jsdom.window.document,
    });
  });

  it("should handle insertion correctly", () => {
    const diffs: DependencyListDiff = {
      insert: [
        {
          dep: { name: "script1", version: "0.0.0" },
          prevDep: null,
        },
      ],
      remove: [],
      update: [],
      move: [],
    };

    manager.applyDependencyDiffs(diffs);
    expect(manager["tags"]).toHaveLength(1);
    expect(manager.getTags()).toMatchInlineSnapshot(`
      [
        {
          "attributes": {},
          "executed": false,
          "loaded": false,
          "src": "script1@0.0.0.js",
          "type": "script",
        },
      ]
    `);
    expect(manager["tags"][0].src).toEqual("script1.js");
  });

  it("should handle removal correctly", () => {
    // 先插入一个标签，然后移除
    manager.applyDependencyDiffs({
      insert: [
        {
          dep: { name: "script1", version: "0.0.0" },
          prevDep: null,
        },
      ],
      remove: [],
      update: [],
      move: [],
    });
    manager.applyDependencyDiffs({
      insert: [],
      remove: [{ name: "script1", version: "0.0.0" }],
      update: [],
      move: [],
    });
    expect(manager.getTags()).toMatchInlineSnapshot(`[]`);
    expect(manager["tags"]).toHaveLength(0);
  });

  it("should handle updates correctly", () => {
    // 先插入，再更新
    manager.applyDependencyDiffs({
      insert: [
        {
          dep: { name: "script1", version: "0.0.0" },
          prevDep: null,
        },
      ],
      remove: [],
      update: [],
      move: [],
    });
    manager.applyDependencyDiffs({
      insert: [],
      remove: [],
      update: [
        {
          name: "script1",
          version: "0.0.0",
          data: {
            async: "true",
          },
        },
      ],
      move: [],
    });
    expect(manager.getTags()).toMatchInlineSnapshot(`
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
    expect(manager["tags"][0].attributes.async).toEqual("true");
  });

  it("should maintain execution order across multiple inserts", () => {
    // 插入多个依次依赖的标签
    manager.applyDependencyDiffs({
      insert: [
        {
          dep: { name: "script1.js", version: "0.0.0" },
          prevDep: null,
        },
        {
          dep: { name: "script2.js", version: "0.0.0" },
          prevDep: { name: "script1.js", version: "0.0.0" },
        },
      ],
      remove: [],
      update: [],
      move: [],
    });
    manager.applyDependencyDiffs({
      insert: [
        {
          dep: { name: "script3.js", version: "0.0.0" },
          prevDep: { name: "script2.js", version: "0.0.0" },
        },
      ],
      remove: [],
      update: [],
      move: [],
    });
    manager.applyDependencyDiffs({
      insert: [
        {
          dep: { name: "script2.1.js", version: "0.0.0" },
          prevDep: { name: "script2.js", version: "0.0.0" },
        },
      ],
      remove: [],
      update: [],
      move: [],
    });
    expect(manager.getTags()).toMatchInlineSnapshot(`
      [
        {
          "attributes": {},
          "executed": false,
          "loaded": false,
          "src": "script1.js@0.0.0.js",
          "type": "script",
        },
        {
          "attributes": {},
          "executed": false,
          "loaded": false,
          "src": "script2.js@0.0.0.js",
          "type": "script",
        },
        {
          "attributes": {},
          "executed": false,
          "loaded": false,
          "src": "script2.1.js@0.0.0.js",
          "type": "script",
        },
        {
          "attributes": {},
          "executed": false,
          "loaded": false,
          "src": "script3.js@0.0.0.js",
          "type": "script",
        },
      ]
    `);
  });
});
