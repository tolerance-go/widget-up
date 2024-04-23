import { parseExternal } from "../src/parseExternal";
import { ExternalSchemaConfig, ParsedExternalConfig } from "../types";

describe("parseExternal", () => {
  it("peerDependencies", () => {
    const input: ExternalSchemaConfig = {
      "react-dom": {
        unpkg: {
          filePath: "",
        },
        peerDependencies: "react",
      },
    };
    const expected: ParsedExternalConfig = {
      "react-dom": {
        unpkg: {
          filePath: "",
        },
        peerDependencies: ["react"],
      },
    };
    const result = parseExternal(input);
    expect(result).toEqual(expected);
  });

  it("should handle object configurations with global and peerDependencies", () => {
    const input: ExternalSchemaConfig = {
      "react-dom": {
        unpkg: {
          filePath: "",
        },
        peerDependencies: ["react"],
      },
    };
    const expected: ParsedExternalConfig = {
      "react-dom": {
        unpkg: {
          filePath: "",
        },
        peerDependencies: ["react"],
      },
    };
    const result = parseExternal(input);
    expect(result).toEqual(expected);
  });

  it("should return an empty object when given an empty configuration", () => {
    const input: ExternalSchemaConfig = {};
    const expected: ParsedExternalConfig = {};
    const result = parseExternal(input);
    expect(result).toEqual(expected);
  });
});
