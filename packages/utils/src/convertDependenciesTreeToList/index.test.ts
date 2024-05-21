import { convertDependenciesTreeToList } from ".";
import {
  PeerDependenciesTree,
  PeerDependenciesNode,
} from "../getPeerDependTree";

describe("convertDependenciesTreeToList", () => {
  it("应将包含一个叶子节点的简单树转换为列表", () => {
    const tree: PeerDependenciesTree = {
      packageA: {
        version: {
          exact: "1.0.0",
          range: "^1.0.0",
        },
        name: "packageA",
        peerDependencies: {},
      },
    };

    const expected: PeerDependenciesNode[] = [
      {
        version: {
          exact: "1.0.0",
          range: "^1.0.0",
        },
        name: "packageA",
      },
    ];

    expect(convertDependenciesTreeToList(tree)).toEqual(expected);
  });

  it("应将嵌套树转换为叶子节点列表", () => {
    const tree: PeerDependenciesTree = {
      packageA: {
        version: {
          exact: "1.0.0",
          range: "^1.0.0",
        },
        name: "packageA",
        peerDependencies: {
          packageB: {
            version: {
              exact: "1.1.0",
              range: "^1.1.0",
            },
            name: "packageB",
            peerDependencies: {
              packageC: {
                version: {
                  exact: "1.2.0",
                  range: "^1.2.0",
                },
                name: "packageC",
                peerDependencies: {},
              },
            },
          },
        },
      },
    };

    const expected: PeerDependenciesNode[] = [
      {
        version: {
          exact: "1.2.0",
          range: "^1.2.0",
        },
        name: "packageC",
      },
    ];

    expect(convertDependenciesTreeToList(tree)).toEqual(expected);
  });

  it("应正确处理具有多个分支的树", () => {
    const tree: PeerDependenciesTree = {
      packageA: {
        version: {
          exact: "1.0.0",
          range: "^1.0.0",
        },
        name: "packageA",
        peerDependencies: {
          packageB: {
            version: {
              exact: "1.1.0",
              range: "^1.1.0",
            },
            name: "packageB",
            peerDependencies: {},
          },
          packageC: {
            version: {
              exact: "1.2.0",
              range: "^1.2.0",
            },
            name: "packageC",
            peerDependencies: {},
          },
        },
      },
    };

    const expected: PeerDependenciesNode[] = [
      {
        version: {
          exact: "1.1.0",
          range: "^1.1.0",
        },
        name: "packageB",
      },
      {
        version: {
          exact: "1.2.0",
          range: "^1.2.0",
        },
        name: "packageC",
      },
    ];

    expect(convertDependenciesTreeToList(tree)).toEqual(expected);
  });

  it("应处理空树", () => {
    const tree: PeerDependenciesTree = {};

    const expected: PeerDependenciesNode[] = [];

    expect(convertDependenciesTreeToList(tree)).toEqual(expected);
  });

  it("应处理具有多个嵌套依赖项的复杂树", () => {
    const tree: PeerDependenciesTree = {
      packageA: {
        version: {
          exact: "1.0.0",
          range: "^1.0.0",
        },
        name: "packageA",
        peerDependencies: {
          packageB: {
            version: {
              exact: "1.1.0",
              range: "^1.1.0",
            },
            name: "packageB",
            peerDependencies: {
              packageC: {
                version: {
                  exact: "1.2.0",
                  range: "^1.2.0",
                },
                name: "packageC",
                peerDependencies: {},
              },
              packageD: {
                version: {
                  exact: "1.3.0",
                  range: "^1.3.0",
                },
                name: "packageD",
                peerDependencies: {
                  packageE: {
                    version: {
                      exact: "1.4.0",
                      range: "^1.4.0",
                    },
                    name: "packageE",
                    peerDependencies: {},
                  },
                },
              },
            },
          },
        },
      },
    };

    const expected: PeerDependenciesNode[] = [
      {
        version: {
          exact: "1.2.0",
          range: "^1.2.0",
        },
        name: "packageC",
      },
      {
        version: {
          exact: "1.4.0",
          range: "^1.4.0",
        },
        name: "packageE",
      },
    ];

    expect(convertDependenciesTreeToList(tree)).toEqual(expected);
  });

  it("应处理重复的依赖项", () => {
    const tree: PeerDependenciesTree = {
      packageA: {
        version: {
          exact: "1.0.0",
          range: "^1.0.0",
        },
        name: "packageA",
        peerDependencies: {
          packageB: {
            version: {
              exact: "1.1.0",
              range: "^1.1.0",
            },
            name: "packageB",
            peerDependencies: {
              packageC: {
                version: {
                  exact: "1.2.0",
                  range: "^1.2.0",
                },
                name: "packageC",
                peerDependencies: {},
              },
            },
          },
          packageC: {
            version: {
              exact: "1.2.0",
              range: "^1.2.0",
            },
            name: "packageC",
            peerDependencies: {},
          },
        },
      },
    };

    const expected: PeerDependenciesNode[] = [
      {
        version: {
          exact: "1.2.0",
          range: "^1.2.0",
        },
        name: "packageC",
      },
    ];

    expect(convertDependenciesTreeToList(tree)).toEqual(expected);
  });
});
