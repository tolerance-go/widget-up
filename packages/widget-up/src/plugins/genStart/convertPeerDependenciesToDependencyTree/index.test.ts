import { DependencyTreeNode } from "widget-up-runtime";
import { convertPeerDependenciesToDependencyTree } from ".";
import { PeerDependenciesTree } from "@/src/utils/getPeerDependTree";

describe("convertPeerDependenciesToDependencyTree", () => {
  it("should correctly convert a simple peer dependencies tree", () => {
    const input: PeerDependenciesTree = {
      react: {
        version: "17.0.1",
      },
    };

    const expectedOutput: DependencyTreeNode[] = [
      {
        name: "react",
        version: "17.0.1",
        scriptSrc: expect.any(Function),
        linkHref: expect.any(Function),
        depends: undefined,
      },
    ];

    const result = convertPeerDependenciesToDependencyTree(input);
    expect(result).toEqual(expectedOutput);
  });

  it("should handle nested dependencies", () => {
    const input: PeerDependenciesTree = {
      react: {
        version: "17.0.1",
        peerDependencies: {
          "react-dom": {
            version: "17.0.1",
          },
        },
      },
    };

    const expectedOutput: DependencyTreeNode[] = [
      {
        name: "react",
        version: "17.0.1",
        scriptSrc: expect.any(Function),
        linkHref: expect.any(Function),
        depends: [
          {
            name: "react-dom",
            version: "17.0.1",
            scriptSrc: expect.any(Function),
            linkHref: expect.any(Function),
            depends: undefined,
          },
        ],
      },
    ];

    const result = convertPeerDependenciesToDependencyTree(input);
    expect(result).toEqual(expectedOutput);
  });
});
