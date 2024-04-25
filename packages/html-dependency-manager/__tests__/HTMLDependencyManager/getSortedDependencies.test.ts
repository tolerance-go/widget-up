// HTMLDependencyManager.test.ts

import { HTMLDependencyManager } from "@/src/HTMLDependencyManager";

describe("HTMLDependencyManager getSortedDependencies", () => {
  let manager: HTMLDependencyManager;
  const mockFetchVersionList = jest.fn();

  beforeEach(async () => {
    mockFetchVersionList.mockReset();
    mockFetchVersionList.mockImplementation((dependencyName: string) => {
      const versions: Record<string, string[]> = {
        react: ["16.8.0", "16.13.1", "17.0.0"],
        "react-dom": ["16.8.0", "16.13.1", "17.0.0"],
        redux: ["4.0.4", "4.0.5", "4.1.0"],
      };
      return Promise.resolve(versions[dependencyName] || []);
    });

    manager = new HTMLDependencyManager(mockFetchVersionList);
    await manager.addDependency(
      "react",
      "^16.8.0",
      { "react-dom": "^16.8.0" },
    );
    await manager.addDependency("redux", "^4.0.5", { react: "^17.0.0" });
  });

  test("getSortedDependencies should sort dependencies correctly", () => {

    expect(manager.getDependencies()).toMatchSnapshot();

    // const sortedDependencies = manager.getSortedDependencies();

    // expect(sortedDependencies).toEqual([
    //   {
    //     name: "react-dom",
    //     version: "16.13.1",
    //     isGlobal: false,
    //     subDependencies: {},
    //   },
    //   {
    //     name: "react",
    //     version: "16.13.1",
    //     isGlobal: true,
    //     subDependencies: {
    //       "react-dom": {
    //         name: "react-dom",
    //         version: "16.13.1",
    //         isGlobal: false,
    //         subDependencies: {},
    //       },
    //     },
    //   },
    //   {
    //     name: "react",
    //     version: "17.0.0",
    //     isGlobal: false,
    //     subDependencies: {},
    //   },
    //   {
    //     name: "redux",
    //     version: "4.1.0",
    //     isGlobal: true,
    //     subDependencies: {
    //       react: {
    //         name: 'react',
    //         version: "17.0.0",
    //         isGlobal: false,
    //         subDependencies: {},
    //       },
    //     },
    //   },
    // ]);
  });
});
