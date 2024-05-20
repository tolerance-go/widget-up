import { normalizePath } from ".";

describe("normalizePath", () => {
  // 测试在 Windows 风格的路径被正确转换
  test("converts Windows path separators to Unix style", () => {
    const windowsPath = "C:\\Users\\Username\\Documents\\example.txt";
    const expected = "C:/Users/Username/Documents/example.txt";
    expect(normalizePath(windowsPath)).toBe(expected);
  });

  // 测试当路径已经是 Unix 风格时不做更改
  test("does not alter Unix style paths", () => {
    const unixPath = "/var/log/syslog";
    expect(normalizePath(unixPath)).toBe(unixPath);
  });

  // 测试混合使用 Windows 和 Unix 风格的路径
  test("converts mixed Windows and Unix path separators to Unix style", () => {
    const mixedPath = "C:\\Users/Username\\Documents/example.txt";
    const expected = "C:/Users/Username/Documents/example.txt";
    expect(normalizePath(mixedPath)).toBe(expected);
  });

  // 测试包含重复分隔符的路径
  test("converts paths with repeated separators", () => {
    const repeatedSeparators =
      "C:\\\\Users\\\\Username\\Documents\\\\example.txt";
    const expected = "C://Users//Username/Documents//example.txt";
    expect(normalizePath(repeatedSeparators)).toBe(expected);
  });
});
