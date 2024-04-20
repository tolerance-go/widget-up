import { parseExternal } from "./parseExternal";
import { ExternalConfig, ParsedExternalConfig } from "./types";

describe("parseExternal", () => {
  it("peerDependencies", () => {
    const input: ExternalConfig = {
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
    const input: ExternalConfig = {
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
    const input: ExternalConfig = {};
    const expected: ParsedExternalConfig = {};
    const result = parseExternal(input);
    expect(result).toEqual(expected);
  });
});
