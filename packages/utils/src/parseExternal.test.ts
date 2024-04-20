import { parseExternal } from "./parseExternal";
import { ExternalConfig, ParsedExternalConfig } from "./types";

describe("parseExternal", () => {
  it("should handle basic string configurations", () => {
    const input: ExternalConfig = {
      react: "React",
    };
    const expected: ParsedExternalConfig = {
      react: {
        global: "React",
      },
    };
    const result = parseExternal(input);
    expect(result).toEqual(expected);
  });

  it("peerDependencies", () => {
    const input: ExternalConfig = {
      "react-dom": {
        peerDependencies: "react",
      },
    };
    const expected: ParsedExternalConfig = {
      "react-dom": {
        peerDependencies: ["react"],
      },
    };
    const result = parseExternal(input);
    expect(result).toEqual(expected);
  });

  it("should handle object configurations with global and peerDependencies", () => {
    const input: ExternalConfig = {
      "react-dom": {
        global: "ReactDOM",
        peerDependencies: ["react"],
      },
    };
    const expected: ParsedExternalConfig = {
      "react-dom": {
        global: "ReactDOM",
        peerDependencies: ["react"],
      },
    };
    const result = parseExternal(input);
    expect(result).toEqual(expected);
  });

  it("should return an empty object when given an empty configuration", () => {
    const input: ExternalConfig = {};
    const expected: ParsedExternalConfig = {};
    const result = parseExternal(input);
    expect(result).toEqual(expected);
  });
});
