import { HtmlDependencyManager } from "@/src/HtmlDependencyManager";
import { JSDOM } from "jsdom";
import { formatHeadHtml } from "@/__tests__/_utils";

describe("HtmlDependencyManager", () => {
  let manager: HtmlDependencyManager;
  let document: Document;

  beforeEach(() => {
    // 使用 JSDOM 创建一个新的 Document 对象
    document = new JSDOM(`<html><head></head><body></body></html>`).window
      .document;
    // 创建 HtmlDependencyManager 的实例
    manager = new HtmlDependencyManager({
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
      scriptSrcBuilder: (dep) => `path/to/${dep.name}@${dep.version}.js`,
      linkHrefBuilder: (dep) => `path/to/${dep.name}@${dep.version}.css`,
    });
  });

  it("should correctly update script tags when dependencies are added", async () => {
    await manager.addDependency("redux", "^4.0.5", {
      react: "^17.0.0", // Second level
      "redux-thunk": "^2.3.0", // Second level
    });
    await manager.addDependency("react", "^17.0.0", {
      "react-dom": "^16.8.0", // Third level
    });
    await manager.addDependency("redux-thunk", "^2.3.0", {
      axios: "^0.21.1", // Third level
    });

    expect(manager.getSortedDependencies()).toMatchInlineSnapshot(`
      [
        {
          "isGlobal": false,
          "name": "react-dom",
          "subDependencies": {},
          "version": "16.13.1",
          "versionRange": "^16.8.0",
        },
        {
          "isGlobal": true,
          "name": "react",
          "subDependencies": {
            "react-dom": {
              "isGlobal": false,
              "name": "react-dom",
              "subDependencies": {},
              "version": "16.13.1",
              "versionRange": "^16.8.0",
            },
          },
          "version": "17.0.0",
          "versionRange": "^17.0.0",
        },
        {
          "isGlobal": false,
          "name": "axios",
          "subDependencies": {},
          "version": "0.21.1",
          "versionRange": "^0.21.1",
        },
        {
          "isGlobal": true,
          "name": "redux-thunk",
          "subDependencies": {
            "axios": {
              "isGlobal": false,
              "name": "axios",
              "subDependencies": {},
              "version": "0.21.1",
              "versionRange": "^0.21.1",
            },
          },
          "version": "2.4.0",
          "versionRange": "^2.3.0",
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
                  "version": "16.13.1",
                  "versionRange": "^16.8.0",
                },
              },
              "version": "17.0.0",
              "versionRange": "^17.0.0",
            },
            "redux-thunk": {
              "isGlobal": true,
              "name": "redux-thunk",
              "subDependencies": {
                "axios": {
                  "isGlobal": false,
                  "name": "axios",
                  "subDependencies": {},
                  "version": "0.21.1",
                  "versionRange": "^0.21.1",
                },
              },
              "version": "2.4.0",
              "versionRange": "^2.3.0",
            },
          },
          "version": "4.1.0",
          "versionRange": "^4.0.5",
        },
      ]
    `);

    expect(formatHeadHtml(document)).toMatchInlineSnapshot(`
      "<link href="path/to/react-dom@16.13.1.css" rel="stylesheet" data-managed="true">
      <link href="path/to/react@17.0.0.css" rel="stylesheet" data-managed="true">
      <script src="path/to/react@17.0.0.js" async="true" data-managed="true"></script>
      <link href="path/to/axios@0.21.1.css" rel="stylesheet" data-managed="true">
      <link href="path/to/redux-thunk@2.4.0.css" rel="stylesheet" data-managed="true">
      <script src="path/to/redux-thunk@2.4.0.js" async="true" data-managed="true"></script>
      <link href="path/to/redux@4.1.0.css" rel="stylesheet" data-managed="true">
      <script src="path/to/redux@4.1.0.js" async="true" data-managed="true"></script>
      <script src="path/to/react-dom@16.13.1.js" async="true" data-managed="true"></script>
      <script src="path/to/axios@0.21.1.js" async="true" data-managed="true"></script>"
    `);
  });
});
