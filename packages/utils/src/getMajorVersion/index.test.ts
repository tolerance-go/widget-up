import { getMajorVersion } from ".";

describe("getMajorVersion", () => {
  it("should return the major version from a full version string", () => {
    expect(getMajorVersion("1.20.3")).toBe(1);
    expect(getMajorVersion("2.5.1")).toBe(2);
  });

  it("should throw an error for invalid version formats", () => {
    expect(() => getMajorVersion("invalid.version")).toThrow(
      "Invalid version format"
    );
  });
});
