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
        package: {
          name: "packageA",
          version: "1.0.0",
        },
      },
    };

    const expected: PeerDependenciesNode[] = [
      {
        version: {
          exact: "1.0.0",
          range: "^1.0.0",
        },
        name: "packageA",
        package: {
          name: "packageA",
          version: "1.0.0",
        },
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
        package: {
          name: "packageA",
          version: "1.0.0",
        },
        peerDependencies: {
          packageB: {
            version: {
              exact: "1.1.0",
              range: "^1.1.0",
            },
            name: "packageB",
            package: {
              name: "packageB",
              version: "1.1.0",
            },
            peerDependencies: {
              packageC: {
                version: {
                  exact: "1.2.0",
                  range: "^1.2.0",
                },
                name: "packageC",
                peerDependencies: {},
                package: {
                  name: "packageC",
                  version: "1.2.0",
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
        package: {
          name: "packageC",
          version: "1.2.0",
        },
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
        package: {
          name: "packageA",
          version: "1.0.0",
        },
        peerDependencies: {
          packageB: {
            version: {
              exact: "1.1.0",
              range: "^1.1.0",
            },
            name: "packageB",
            package: {
              name: "packageB",
              version: "1.1.0",
            },
            peerDependencies: {},
          },
          packageC: {
            version: {
              exact: "1.2.0",
              range: "^1.2.0",
            },
            name: "packageC",
            package: {
              name: "packageC",
              version: "1.2.0",
            },
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
        package: {
          name: "packageB",
          version: "1.1.0",
        },
      },
      {
        version: {
          exact: "1.2.0",
          range: "^1.2.0",
        },
        name: "packageC",
        package: {
          name: "packageC",
          version: "1.2.0",
        },
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
        package: {
          name: "packageA",
          version: "1.0.0",
        },
        peerDependencies: {
          packageB: {
            version: {
              exact: "1.1.0",
              range: "^1.1.0",
            },
            name: "packageB",
            package: {
              name: "packageB",
              version: "1.1.0",
            },
            peerDependencies: {
              packageC: {
                version: {
                  exact: "1.2.0",
                  range: "^1.2.0",
                },
                name: "packageC",
                package: {
                  name: "packageC",
                  version: "1.2.0",
                },
                peerDependencies: {},
              },
              packageD: {
                version: {
                  exact: "1.3.0",
                  range: "^1.3.0",
                },
                name: "packageD",
                package: {
                  name: "packageD",
                  version: "1.3.0",
                },
                peerDependencies: {
                  packageE: {
                    version: {
                      exact: "1.4.0",
                      range: "^1.4.0",
                    },
                    name: "packageE",
                    package: {
                      name: "packageE",
                      version: "1.4.0",
                    },
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
        package: {
          name: "packageC",
          version: "1.2.0",
        },
      },
      {
        version: {
          exact: "1.4.0",
          range: "^1.4.0",
        },
        name: "packageE",
        package: {
          name: "packageE",
          version: "1.4.0",
        },
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
        package: {
          name: "packageA",
          version: "1.0.0",
        },
        peerDependencies: {
          packageB: {
            version: {
              exact: "1.1.0",
              range: "^1.1.0",
            },
            name: "packageB",
            package: {
              name: "packageB",
              version: "1.1.0",
            },
            peerDependencies: {
              packageC: {
                version: {
                  exact: "1.2.0",
                  range: "^1.2.0",
                },
                name: "packageC",
                package: {
                  name: "packageC",
                  version: "1.2.0",
                },
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
            package: {
              name: "packageC",
              version: "1.2.0",
            },
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
        package: {
          name: "packageC",
          version: "1.2.0",
        },
      },
    ];

    expect(convertDependenciesTreeToList(tree)).toEqual(expected);
  });
});
