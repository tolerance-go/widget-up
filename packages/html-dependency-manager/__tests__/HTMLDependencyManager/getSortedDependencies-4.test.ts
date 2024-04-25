import { HTMLDependencyManager } from "@/src/HTMLDependencyManager";

describe("HTMLDependencyManager getSortedDependencies", () => {
  let manager: HTMLDependencyManager;
  const mockFetchVersionList = jest.fn();

  beforeEach(async () => {
    mockFetchVersionList.mockReset();
    mockFetchVersionList.mockImplementation((dependencyName: string) => {
      const versions: Record<string, string[]> = {
        react: ["16.8.0", "16.13.1", "17.0.0", "17.0.2"],
        "react-dom": ["16.8.0", "16.13.1", "17.0.0", "17.0.2"],
        redux: ["4.0.4", "4.0.5", "4.1.0"],
        lodash: ["3.0.0", "4.17.15", "4.17.20"],
      };
      return Promise.resolve(versions[dependencyName] || []);
    });

    manager = new HTMLDependencyManager(mockFetchVersionList);
  });

  test("handles multiple versions of the same dependency independently", async () => {
    // React 16 used in one part of the project
    await manager.addDependency("react", "^16.8.0", {
      "react-dom": "^16.8.0",
    });
    // React 17 used in another part of the project
    await manager.addDependency("react", "^17.0.0", {
      "react-dom": "^17.0.0",
    });

    const sortedDependencies = manager.getSortedDependencies();
    expect(sortedDependencies).toMatchInlineSnapshot(`
      [
        {
          "isGlobal": false,
          "name": "react-dom",
          "subDependencies": {},
          "version": "16.13.1",
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
            },
          },
          "version": "16.13.1",
        },
        {
          "isGlobal": false,
          "name": "react-dom",
          "subDependencies": {},
          "version": "17.0.2",
        },
        {
          "isGlobal": true,
          "name": "react",
          "subDependencies": {
            "react-dom": {
              "isGlobal": false,
              "name": "react-dom",
              "subDependencies": {},
              "version": "17.0.2",
            },
          },
          "version": "17.0.2",
        },
      ]
    `);
  });

  test("handles dependencies where different versions have different subdependencies", async () => {
    // Adding dependencies with different subdependencies across versions
    await manager.addDependency("lodash", "^4.17.15");
    await manager.addDependency("redux", "^4.0.5", {
      lodash: "^3.0.0", // Higher version required by redux
    });

    const sortedDependencies = manager.getSortedDependencies();
    expect(sortedDependencies).toMatchInlineSnapshot(`
      [
        {
          "isGlobal": true,
          "name": "lodash",
          "subDependencies": {},
          "version": "4.17.20",
        },
        {
          "isGlobal": false,
          "name": "lodash",
          "subDependencies": {},
          "version": "3.0.0",
        },
        {
          "isGlobal": true,
          "name": "redux",
          "subDependencies": {
            "lodash": {
              "isGlobal": false,
              "name": "lodash",
              "subDependencies": {},
              "version": "3.0.0",
            },
          },
          "version": "4.1.0",
        },
      ]
    `);
  });

  test("consistency check for dependencies across different versions", async () => {
    // Adding multiple versions where earlier versions might be indirectly upgraded
    await manager.addDependency("react", "^16.8.0");
    await manager.addDependency("redux", "^4.0.5", {
      react: "^17.0.0", // This might indirectly affect previously added react dependency
    });

    const sortedDependencies = manager.getSortedDependencies();
    expect(sortedDependencies).toMatchInlineSnapshot(`
      [
        {
          "isGlobal": true,
          "name": "react",
          "subDependencies": {},
          "version": "16.13.1",
        },
        {
          "isGlobal": false,
          "name": "react",
          "subDependencies": {},
          "version": "17.0.2",
        },
        {
          "isGlobal": true,
          "name": "redux",
          "subDependencies": {
            "react": {
              "isGlobal": false,
              "name": "react",
              "subDependencies": {},
              "version": "17.0.2",
            },
          },
          "version": "4.1.0",
        },
      ]
    `);
  });
});
