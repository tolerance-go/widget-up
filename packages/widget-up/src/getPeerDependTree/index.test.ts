import getPeerDependTree from ".";
import fs from "fs";
import path from "path";
import { jest } from "@jest/globals";

const mockDeps = {
  fileSystem: {
    readFileSync: jest.fn(() =>
      JSON.stringify({
        peerDependencies: { react: "^16.8.0", lodash: "^4.17.15" },
      })
    ),
  },
  pathUtility: {
    join: (...args: any[]) => args.join("/"),
  },
};

describe("getPeerDependTree", () => {
  it("should correctly parse peerDependencies from package.json", () => {
    const result = getPeerDependTree({ cwd: "/fake/directory" }, mockDeps as any);
    expect(result).toEqual({
      react: { version: "^16.8.0", dependencies: {} },
      lodash: { version: "^4.17.15", dependencies: {} },
    });
  });
});
