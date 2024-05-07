import { jest } from "@jest/globals";
import getPeerDependTree from ".";

jest.unstable_mockModule("fs", async () => ({
  readFileSync: jest.fn((libPath: string) => {
    return JSON.stringify(
      libPath.endsWith("utils/package.json")
        ? {}
        : libPath.endsWith("react/package.json")
        ? {
            peerDependencies: {
              utils: "^16.8.0",
            },
          }
        : libPath.endsWith("react-dom/package.json")
        ? {
            peerDependencies: {
              react: "^16.8.0",
            },
          }
        : {
            peerDependencies: { "react-dom": "^16.8.0" },
          }
    );
  }),
}));
jest.unstable_mockModule("path", async () => ({
  join: (...args: any[]) => args.join("/"),
}));

const fs = await import("fs");
const path = await import("path");

describe("getPeerDependTree", () => {
  it("should correctly parse peerDependencies from package.json", () => {
    const result = getPeerDependTree({ cwd: "/fake/directory" }, { fs, path });
    expect(result).toMatchInlineSnapshot(`
      {
        "react-dom": {
          "peerDependencies": {
            "react": {
              "peerDependencies": {
                "utils": {
                  "peerDependencies": {},
                  "version": "^16.8.0",
                },
              },
              "version": "^16.8.0",
            },
          },
          "version": "^16.8.0",
        },
      }
    `);
  });
});
