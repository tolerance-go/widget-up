import { PeerDependenciesTree } from "widget-up-utils";
import { convertPeerDependenciesTreeToDependencyTreeNodes } from ".";

describe("convertNode", () => {
  it("应该将 PeerDependenciesNode 转换为 DependencyTreeNodeJSON", () => {
    const node: PeerDependenciesTree = {
      packageA: {
        name: "packageA",
        version: { exact: "1.0.0", range: "^1.0.0" },
        packageConfig: {
          name: "packageA",
          version: "1.0.0",
        },
        peerDependencies: {
          packageB: {
            name: "packageB",
            version: { exact: "1.0.0", range: "^1.0.0" },
            packageConfig: {
              name: "packageB",
              version: "1.0.0",
            },
          },
        },
      },
    };

    expect(convertPeerDependenciesTreeToDependencyTreeNodes(node))
      .toMatchInlineSnapshot(`
      [
        {
          "depends": [
            {
              "depends": [],
              "linkHref": "() => ''",
              "name": "packageB",
              "scriptSrc": "(dep) => \`/libs/packageB_v1_0_0.js\`",
              "version": "1.0.0",
            },
          ],
          "linkHref": "() => ''",
          "name": "packageA",
          "scriptSrc": "(dep) => \`/libs/packageA_v1_0_0.js\`",
          "version": "1.0.0",
        },
      ]
    `);
  });
});