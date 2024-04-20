import { parseConfig } from "../parseConfig";
import { Config } from "../types";

describe("parseConfig", () => {
  it("should correctly parse a full configuration object", () => {
    const inputConfig: Config = {
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
    };

    const result = parseConfig(inputConfig);
    expect(result).toEqual(expectedOutput);
  });

  it("should handle configurations without UMD correctly", () => {
    const inputConfig: Config = {
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
