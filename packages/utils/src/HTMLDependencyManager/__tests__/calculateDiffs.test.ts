import { HTMLDependencyManager } from "@/src/HTMLDependencyManager";
import { JSDOM } from "jsdom";

describe("HTMLDependencyManager calculateDiffs", () => {
  let manager: HTMLDependencyManager;
  const mockFetchVersionList = jest.fn();

  beforeEach(() => {
    mockFetchVersionList.mockReset();
    const jsdom = new JSDOM(`<!DOCTYPE html>`);
    manager = new HTMLDependencyManager({
      fetchVersionList: mockFetchVersionList,
      document: jsdom.window.document,
    });
  });

  test("should detect moved dependencies", async () => {
    // 初始标签
    manager.lastDependencies = [
      {
        version: "1.0.0",
        name: "lib1",
      },
      {
        version: "1.0.0",
        name: "lib2",
      },
    ];

    // 新标签列表，改变顺序
    manager.getDependencyList = jest.fn().mockReturnValue([
      {
        name: "lib2",
        version: "1.0.0",
      },
      {
        name: "lib1",
        version: "1.0.0",
      },
    ]);

    const diffs = manager.calculateDiffs();

    // 检查移动操作是否正确识别
    expect(diffs.move.length).toBe(1); // 两个标签都移动了
    expect(diffs.move).toMatchInlineSnapshot(`
      [
        {
          "dep": {
            "name": "lib2",
            "version": "1.0.0",
          },
          "prevDep": null,
        },
      ]
    `); // 两个标签都移动了
  });

  test("should detect moved dependencies 2", async () => {
    // 初始标签
    manager.lastDependencies = [
      {
        name: "lib1",
        version: "1.0.0",
      },
      {
        name: "lib2",
        version: "1.0.0",
      },
      {
        name: "lib3",
        version: "1.0.0",
      },
    ];

    // 新标签列表，改变顺序
    manager.getDependencyList = jest.fn().mockReturnValue([
      {
        name: "lib1",
        version: "1.0.0",
      },
      {
        name: "lib3",
        version: "1.0.0",
      },
      {
        name: "lib2",
        version: "1.0.0",
      },
    ]);

    const diffs = manager.calculateDiffs();

    expect(diffs).toMatchInlineSnapshot(`
      {
        "insert": [],
        "move": [
          {
            "dep": {
              "name": "lib3",
              "version": "1.0.0",
            },
            "prevDep": {
              "name": "lib1",
              "version": "1.0.0",
            },
          },
        ],
        "remove": [],
        "update": [],
      }
    `);
  });

  test("should detect moved dependencies 3", async () => {
    // 初始标签
    manager.lastDependencies = [
      {
        name: "lib1",
        version: "1.0.0",
      },
      {
        name: "lib2",
        version: "1.0.0",
      },
      {
        name: "lib3",
        version: "1.0.0",
      },
    ];

    // 新标签列表，改变顺序
    manager.getDependencyList = jest.fn().mockReturnValue([
      {
        name: "lib2",
        version: "1.0.0",
      },
      {
        name: "lib1",
        version: "1.0.0",
      },
      {
        name: "lib3",
        version: "1.0.0",
      },
    ]);

    const diffs = manager.calculateDiffs();

    expect(diffs).toMatchInlineSnapshot(`
      {
        "insert": [],
        "move": [
          {
            "dep": {
              "name": "lib2",
              "version": "1.0.0",
            },
            "prevDep": null,
          },
        ],
        "remove": [],
        "update": [],
      }
    `);
  });

  test("should detect moved dependencies 4", async () => {
    // 初始标签
    manager.lastDependencies = [
      {
        name: "lib1",
        version: "1.0.0",
      },
      {
        name: "lib2",
        version: "1.0.0",
      },
      {
        name: "lib3",
        version: "1.0.0",
      },
      {
        name: "lib4",
        version: "1.0.0",
      },
    ];

    // 新标签列表，改变顺序
    manager.getDependencyList = jest.fn().mockReturnValue([
      {
        name: "lib2",
        version: "1.0.0",
      },
      {
        name: "lib1",
        version: "1.0.0",
      },
      {
        name: "lib4",
        version: "1.0.0",
      },
      {
        name: "lib3",
        version: "1.0.0",
      },
    ]);

    const diffs = manager.calculateDiffs();

    expect(diffs).toMatchInlineSnapshot(`
      {
        "insert": [],
        "move": [
          {
            "dep": {
              "name": "lib2",
              "version": "1.0.0",
            },
            "prevDep": null,
          },
          {
            "dep": {
              "name": "lib4",
              "version": "1.0.0",
            },
            "prevDep": {
              "name": "lib1",
              "version": "1.0.0",
            },
          },
        ],
        "remove": [],
        "update": [],
      }
    `);
  });
});
