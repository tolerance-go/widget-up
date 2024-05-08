import { parseConfig } from ".";
import { SchemaConfig } from "../../types";

describe("parseConfig", () => {
  it("should correctly parse a full configuration object", () => {
    const inputConfig: SchemaConfig = {
      input: "src/index.tsx",
      umd: {
        name: "MyComponent",
        external: ['react', 'react-dom'],
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
        external: ['react', 'react-dom'],
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
      umd: {
        name: "MyComponent",
        external: ['react', 'react-dom'],
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
      input: "src/index.tsx",
      cjs: false,
      esm: true,
      css: true,
    };

    const expectedOutput = {
      umd: {
        name: "MyComponent",
        external: ['react', 'react-dom'],
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
      input: "src/index.tsx",
      cjs: false,
      esm: true,
      css: true,
    };

    const result = parseConfig(inputConfig);
    expect(result).toEqual(expectedOutput);
  });
});
