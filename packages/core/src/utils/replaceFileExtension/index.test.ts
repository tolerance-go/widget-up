import { replaceFileExtension } from ".";

describe("replaceFileExtension", () => {
  it("should replace the extension of a UNIX path", () => {
    const result = replaceFileExtension("example/oldfile.txt", ".md");
    expect(result).toEqual("example/oldfile.md");
  });

  it("should replace the extension of a Windows path", () => {
    const result = replaceFileExtension("example\\oldfile.txt", ".md");
    expect(result).toEqual("example\\oldfile.md");
  });

  it("should handle files without extension", () => {
    const result = replaceFileExtension("example/oldfile", ".md");
    expect(result).toEqual("example/oldfile");
  });

  it("should handle paths with dots in directory names", () => {
    const result = replaceFileExtension("example.v1/oldfile.txt", ".md");
    expect(result).toEqual("example.v1/oldfile.md");
  });

  it("should return unchanged path if no extension present", () => {
    const result = replaceFileExtension("example/oldfile", ".md");
    expect(result).toEqual("example/oldfile");
  });
});
