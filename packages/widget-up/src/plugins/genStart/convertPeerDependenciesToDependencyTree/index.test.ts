import { PeerDependenciesTree } from "@/src/utils/getPeerDependTree";
import { convertPeerDependenciesToDependencyTree } from ".";

describe("convertPeerDependenciesToDependencyTree", () => {
  it("should correctly convert a simple peer dependencies tree", () => {
    const input: PeerDependenciesTree = {
      react: {
        name: "react",
        version: {
          exact: "17.0.1",
          range: "^17.0.1",
        },
      },
    };

    const result = convertPeerDependenciesToDependencyTree(input, {});
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "depends": undefined,
          "linkHref": "() => ''",
          "name": "react",
          "scriptSrc": "dep => \`/libs/\${dep.name}_\${WidgetUpRuntime.utils.semverToIdentifier(dep.version.exact)}.js\`",
          "version": "17.0.1",
        },
      ]
    `);
  });

  it("should handle nested dependencies", () => {
    const input: PeerDependenciesTree = {
      react: {
        name: "react",
        version: {
          exact: "17.0.1",
          range: "^17.0.1",
        },
        peerDependencies: {
          "react-dom": {
            name: "react-dom",
            version: {
              exact: "17.0.1",
              range: "^17.0.1",
            },
          },
        },
      },
    };

    const result = convertPeerDependenciesToDependencyTree(input, {});
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "depends": [
            {
              "depends": undefined,
              "linkHref": "() => ''",
              "name": "react-dom",
              "scriptSrc": "dep => \`/libs/\${dep.name}_\${WidgetUpRuntime.utils.semverToIdentifier(dep.version.exact)}.js\`",
              "version": "17.0.1",
            },
          ],
          "linkHref": "() => ''",
          "name": "react",
          "scriptSrc": "dep => \`/libs/\${dep.name}_\${WidgetUpRuntime.utils.semverToIdentifier(dep.version.exact)}.js\`",
          "version": "17.0.1",
        },
      ]
    `);
  });
});
