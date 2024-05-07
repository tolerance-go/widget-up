import { jest } from "@jest/globals";
import { detectTechStack } from ".";

describe("detectTechStack function", () => {
  beforeEach(async () => {
    // 在每个测试前设置 mock
    await jest.unstable_mockModule("fs", () => {
      return {
        readFileSync: () =>
          JSON.stringify({
            dependencies: {
              react: "^17.0.0",
              "react-dom": "^17.0.0",
              vue: "^3.0.0",
            },
            devDependencies: {},
          }),
      };
    });
  });

  afterEach(async () => {
    // 在每个测试后清理 mock
    jest.resetModules();
  });

  it("should detect React and Vue", async () => {
    const fs = await import("fs");
    const result = detectTechStack({ fs });
    expect(result).toEqual(["React", "Vue"]);
  });
});
