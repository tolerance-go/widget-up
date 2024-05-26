import { parseConfig } from ".";
import { NormalizedConfig, SchemaConfig } from "../../types";
import { jest } from "@jest/globals";

describe("parseConfig", () => {
  it("should correctly parse a full configuration object", () => {
    const inputConfig: SchemaConfig = {
      input: "src/index.tsx",
      umd: {
        $NAME: {
          name: "MyComponent",
          external: ["react", "react-dom"],
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
          browser: "/umd/index.js",
        },
      },
      cjs: true,
      esm: true,
      css: false,
      form: {},
    };

    const expectedOutput: NormalizedConfig = {
      input: "src/index.tsx",
      umd: {
        xxx: {
          name: "MyComponent",
          external: ["react", "react-dom"],
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
          browser: {
            development: "/umd/index.js",
            production: "/umd/index.js",
          },
          exportScopeObjectName: "global",
        },
      },
      cjs: true,
      esm: true,
      css: false,
      form: {},
    };

    const result = parseConfig(inputConfig, {
      name: "xxx",
      version: "0.0.0",
    });
    expect(result).toEqual(expectedOutput);
  });

  it("should handle configurations without UMD correctly", () => {
    const inputConfig: SchemaConfig = {
      umd: {
        $NAME: {
          name: "MyComponent",
          external: ["react", "react-dom"],
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
          browser: {
            development: "/umd/index.js",
            production: "/umd/index.js",
          },
          exportScopeObjectName: "global",
        },
      },
      input: "src/index.tsx",
      cjs: false,
      esm: true,
      css: true,
    };

    const expectedOutput: NormalizedConfig = {
      umd: {
        xxx: {
          name: "MyComponent",
          external: ["react", "react-dom"],
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
          browser: {
            development: "/umd/index.js",
            production: "/umd/index.js",
          },
          exportScopeObjectName: "global",
        },
      },
      input: "src/index.tsx",
      cjs: false,
      esm: true,
      css: true,
      form: {},
    };

    const result = parseConfig(inputConfig, {
      name: "xxx",
      version: "0.0.0",
    });
    expect(result).toEqual(expectedOutput);
  });
});
