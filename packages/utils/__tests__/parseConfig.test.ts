import { parseConfig } from "../src/parseConfig";
import { SchemaConfig } from "../types";

describe("parseConfig", () => {
  it("should correctly parse a full configuration object", () => {
    const inputConfig: SchemaConfig = {
      input: "src/index.tsx",
      umd: {
        name: "MyComponent",
        external: {
          react: {
            unpkg: {
              filePath: "/umd/react.production.min.js",
            },
          },
          "react-dom": {
            unpkg: {
              filePath: "/umd/react-dom.production.min.js",
            },
            peerDependencies: ["react"],
          },
        },
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
      cjs: true,
      esm: true,
      css: false,
      form: {},
    };

    const expectedOutput = {
      input: "src/index.tsx",
      umd: {
        name: "MyComponent",
        external: {
          react: {
            unpkg: {
              filePath: "/umd/react.production.min.js",
            },
          },
          "react-dom": {
            unpkg: {
              filePath: "/umd/react-dom.production.min.js",
            },
            peerDependencies: ["react"],
          },
        },
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
      cjs: true,
      esm: true,
      css: false,
      form: {},
    };

    const result = parseConfig(inputConfig);
    expect(result).toEqual(expectedOutput);
  });

  it("should handle configurations without UMD correctly", () => {
    const inputConfig: SchemaConfig = {
      input: "src/index.tsx",
      cjs: false,
      esm: true,
      css: true,
    };

    const expectedOutput = {
      input: "src/index.tsx",
      umd: undefined,
      cjs: false,
      esm: true,
      css: true,
    };

    const result = parseConfig(inputConfig);
    expect(result).toEqual(expectedOutput);
  });
});
