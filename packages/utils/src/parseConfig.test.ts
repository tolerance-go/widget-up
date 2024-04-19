import { parseConfig } from "./parseConfig";
import { Config } from "./types";

describe("parseConfig", () => {
  it("should correctly parse a full configuration object", () => {
    const inputConfig: Config = {
      input: "src/index.tsx",
      umd: {
        name: "MyComponent",
        external: {
          react: "React",
          "react-dom": {
            global: "ReactDOM",
            peerDependencies: ["react"],
          },
        },
        global: {
          react: {
            unpkg: {
              filePath: "/umd/react.production.min.js",
            },
          },
          "react-dom": {
            unpkg: {
              filePath: "/umd/react-dom.production.min.js",
            },
          },
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
          react: { global: "React" },
          "react-dom": {
            global: "ReactDOM",
            peerDependencies: ["react"],
          },
        },
        global: {
          react: {
            unpkg: {
              filePath: "/umd/react.production.min.js",
            },
          },
          "react-dom": {
            unpkg: {
              filePath: "/umd/react-dom.production.min.js",
            },
          },
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
