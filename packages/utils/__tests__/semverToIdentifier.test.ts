import { semverToIdentifier } from "../src/semverToIdentifier"; // 确保正确引用你的函数

describe("semverToIdentifier", () => {
  it("should convert standard semver to valid identifier", () => {
    expect(semverToIdentifier("1.2.3")).toBe("v1_2_3");
    expect(semverToIdentifier("2.10.0")).toBe("v2_10_0");
  });

  it("should handle pre-release labels correctly", () => {
    expect(semverToIdentifier("1.0.0-alpha")).toBe("v1_0_0_alpha");
    expect(semverToIdentifier("1.0.0-beta.2")).toBe("v1_0_0_beta_2");
  });

  it("should handle build metadata correctly", () => {
    expect(semverToIdentifier("1.0.0+build.001")).toBe("v1_0_0_build_001");
    expect(semverToIdentifier("1.0.0-alpha+001")).toBe("v1_0_0_alpha_001");
  });

  it("should handle complex semver strings", () => {
    expect(semverToIdentifier("0.27.0-rc.2")).toBe("v0_27_0_rc_2");
    expect(semverToIdentifier("2.0.0-alpha.preview.1+build.123")).toBe(
      "v2_0_0_alpha_preview_1_build_123",
    );
  });

  it("should start with a letter and use underscores for non-alphanumeric characters", () => {
    expect(semverToIdentifier("0.0.0")).toMatch(/^v\d+_\d+_\d+$/);
    expect(semverToIdentifier("3.5.1-beta.1")).toMatch(
      /^v\d+_\d+_\d+_\w+_\d+$/,
    );
  });
});
