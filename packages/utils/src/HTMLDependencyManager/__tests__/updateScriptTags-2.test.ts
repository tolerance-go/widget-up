import { formatElementHtml } from "@/__tests__/_utils";
import { HTMLDependencyManager } from "@/src/HTMLDependencyManager";
import { JSDOM } from "jsdom";

describe("HTMLDependencyManager", () => {
  let manager: HTMLDependencyManager;
  let document: Document;
  let scriptContainer: HTMLElement;
  let linkContainer: HTMLElement;
  beforeEach(() => {
    // 使用 JSDOM 创建一个新的 Document 对象
    document = new JSDOM(`<html><head></head><body></body></html>`).window
      .document;
    // 创建 HTMLDependencyManager 的实例
    manager = new HTMLDependencyManager({
      fetchVersionList: async (dependencyName) => {
        const versions: Record<string, string[]> = {
          react: ["16.8.0", "16.13.1", "17.0.0"],
          "react-dom": ["16.8.0", "16.13.1", "17.0.0"],
          redux: ["4.0.4", "4.0.5", "4.1.0"],
          lodash: ["4.17.15", "4.17.19"],
          moment: ["2.24.0", "2.25.0"],
          "react-router": ["5.1.2", "5.2.0"],
          axios: ["0.19.0", "0.21.1"],
          "redux-thunk": ["2.3.0", "2.4.0"],
        };
        return versions[dependencyName] || [];
      },
      document,
      scriptSrcBuilder: (dep) => `path/to/${dep.name}@${dep.version.exact}.js`,
      linkHrefBuilder: (dep) => `path/to/${dep.name}@${dep.version.exact}.css`,
    });
    scriptContainer = manager.tagManager.getScriptContainer();
    linkContainer = manager.tagManager.getLinkContainer();
  });

  it("should correctly update script tags when dependencies are added", async () => {
    await manager.addDependency("redux", "^4.0.5", {
      react: "^17.0.0", // Second level
      "redux-thunk": "^2.3.0", // Second level
    });

    expect(formatElementHtml(scriptContainer)).toMatchInlineSnapshot(`
      "<script src="path/to/react@17.0.0.js" async="true" data-dependency-id="react@17.0.0" data-managed="true"></script>
      <script src="path/to/redux-thunk@2.4.0.js" async="true" data-dependency-id="redux-thunk@2.4.0" data-managed="true"></script>
      <script src="path/to/redux@4.1.0.js" async="true" data-dependency-id="redux@4.1.0" data-managed="true"></script>"
    `);
    expect(formatElementHtml(linkContainer)).toMatchInlineSnapshot(`
      "<link href="path/to/react@17.0.0.css" rel="stylesheet" data-dependency-id="react@17.0.0" data-managed="true">
      <link href="path/to/redux-thunk@2.4.0.css" rel="stylesheet" data-dependency-id="redux-thunk@2.4.0" data-managed="true">
      <link href="path/to/redux@4.1.0.css" rel="stylesheet" data-dependency-id="redux@4.1.0" data-managed="true">"
    `);
    await manager.addDependency("react", "^17.0.0", {
      "react-dom": "^16.8.0", // Third level
    });
    expect(formatElementHtml(scriptContainer)).toMatchInlineSnapshot(`
      "<script src="path/to/react-dom@16.13.1.js" async="true" data-dependency-id="react-dom@16.13.1" data-managed="true"></script>
      <script src="path/to/react@17.0.0.js" async="true" data-dependency-id="react@17.0.0" data-managed="true"></script>
      <script src="path/to/redux-thunk@2.4.0.js" async="true" data-dependency-id="redux-thunk@2.4.0" data-managed="true"></script>
      <script src="path/to/redux@4.1.0.js" async="true" data-dependency-id="redux@4.1.0" data-managed="true"></script>"
    `);
    expect(formatElementHtml(linkContainer)).toMatchInlineSnapshot(`
      "<link href="path/to/react-dom@16.13.1.css" rel="stylesheet" data-dependency-id="react-dom@16.13.1" data-managed="true">
      <link href="path/to/react@17.0.0.css" rel="stylesheet" data-dependency-id="react@17.0.0" data-managed="true">
      <link href="path/to/redux-thunk@2.4.0.css" rel="stylesheet" data-dependency-id="redux-thunk@2.4.0" data-managed="true">
      <link href="path/to/redux@4.1.0.css" rel="stylesheet" data-dependency-id="redux@4.1.0" data-managed="true">"
    `);
    await manager.addDependency("redux-thunk", "^2.3.0", {
      axios: "^0.21.1", // Third level
    });

    expect(manager.getSortedDependencies()).toMatchInlineSnapshot(`
      [
        {
          "isGlobal": false,
          "name": "react-dom",
          "subDependencies": {},
          "version": {
            "exact": "16.13.1",
            "range": "^16.8.0",
          },
        },
        {
          "isGlobal": true,
          "name": "react",
          "subDependencies": {
            "react-dom": {
              "isGlobal": false,
              "name": "react-dom",
              "subDependencies": {},
              "version": {
                "exact": "16.13.1",
                "range": "^16.8.0",
              },
            },
          },
          "version": {
            "exact": "17.0.0",
            "range": "^17.0.0",
          },
        },
        {
          "isGlobal": false,
          "name": "axios",
          "subDependencies": {},
          "version": {
            "exact": "0.21.1",
            "range": "^0.21.1",
          },
        },
        {
          "isGlobal": true,
          "name": "redux-thunk",
          "subDependencies": {
            "axios": {
              "isGlobal": false,
              "name": "axios",
              "subDependencies": {},
              "version": {
                "exact": "0.21.1",
                "range": "^0.21.1",
              },
            },
          },
          "version": {
            "exact": "2.4.0",
            "range": "^2.3.0",
          },
        },
        {
          "isGlobal": true,
          "name": "redux",
          "subDependencies": {
            "react": {
              "isGlobal": true,
              "name": "react",
              "subDependencies": {
                "react-dom": {
                  "isGlobal": false,
                  "name": "react-dom",
                  "subDependencies": {},
                  "version": {
                    "exact": "16.13.1",
                    "range": "^16.8.0",
                  },
                },
              },
              "version": {
                "exact": "17.0.0",
                "range": "^17.0.0",
              },
            },
            "redux-thunk": {
              "isGlobal": true,
              "name": "redux-thunk",
              "subDependencies": {
                "axios": {
                  "isGlobal": false,
                  "name": "axios",
                  "subDependencies": {},
                  "version": {
                    "exact": "0.21.1",
                    "range": "^0.21.1",
                  },
                },
              },
              "version": {
                "exact": "2.4.0",
                "range": "^2.3.0",
              },
            },
          },
          "version": {
            "exact": "4.1.0",
            "range": "^4.0.5",
          },
        },
      ]
    `);

    expect(formatElementHtml(scriptContainer)).toMatchInlineSnapshot(`
      "<script src="path/to/react-dom@16.13.1.js" async="true" data-dependency-id="react-dom@16.13.1" data-managed="true"></script>
      <script src="path/to/react@17.0.0.js" async="true" data-dependency-id="react@17.0.0" data-managed="true"></script>
      <script src="path/to/axios@0.21.1.js" async="true" data-dependency-id="axios@0.21.1" data-managed="true"></script>
      <script src="path/to/redux-thunk@2.4.0.js" async="true" data-dependency-id="redux-thunk@2.4.0" data-managed="true"></script>
      <script src="path/to/redux@4.1.0.js" async="true" data-dependency-id="redux@4.1.0" data-managed="true"></script>"
    `);
    expect(formatElementHtml(linkContainer)).toMatchInlineSnapshot(`
      "<link href="path/to/react-dom@16.13.1.css" rel="stylesheet" data-dependency-id="react-dom@16.13.1" data-managed="true">
      <link href="path/to/react@17.0.0.css" rel="stylesheet" data-dependency-id="react@17.0.0" data-managed="true">
      <link href="path/to/axios@0.21.1.css" rel="stylesheet" data-dependency-id="axios@0.21.1" data-managed="true">
      <link href="path/to/redux-thunk@2.4.0.css" rel="stylesheet" data-dependency-id="redux-thunk@2.4.0" data-managed="true">
      <link href="path/to/redux@4.1.0.css" rel="stylesheet" data-dependency-id="redux@4.1.0" data-managed="true">"
    `);
  });
});
