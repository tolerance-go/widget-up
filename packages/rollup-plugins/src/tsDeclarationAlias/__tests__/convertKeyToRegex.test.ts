import { convertKeyToRegex } from "../convertKeyToRegex";

describe("convertKeyToRegex", () => {
  it("converts simple key with wildcard", () => {
    expect(convertKeyToRegex("@utils/*")).toBe("@utils/(.*)");
  });

  it("converts key without wildcard", () => {
    expect(convertKeyToRegex("@/*")).toBe("@/(.*)");
  });
});
