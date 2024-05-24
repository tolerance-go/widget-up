import { ensure } from ".";

describe("ensure 函数测试", () => {
  test("当条件为真时（布尔值），不抛出异常", () => {
    expect(() => {
      ensure(true, "这是一个测试");
    }).not.toThrow();
  });

  test("当条件为真时，不抛出异常", () => {
    expect(() => {
      ensure(1 + 1 === 2, "数学计算出错");
    }).not.toThrow();
  });

  test("当条件为假时，抛出字符串信息异常", () => {
    expect(() => {
      ensure(1 + 1 === 3, "数学计算出错");
    }).toThrow("数学计算出错");
  });

  test("当条件为假时，抛出对象信息异常", () => {
    expect(() => {
      ensure(1 + 1 === 3, "数学计算出错", { error: "无效计算" });
    }).toThrowErrorMatchingInlineSnapshot(`
      "数学计算出错 {
        "error": "无效计算"
      }"
    `);
  });

  test("当条件为假时，抛出多个信息异常", () => {
    expect(() => {
      ensure(1 + 1 === 3, "数学计算出错", "请检查公式", {
        error: "无效计算",
      });
    }).toThrowErrorMatchingInlineSnapshot(`
      "数学计算出错 请检查公式 {
        "error": "无效计算"
      }"
    `);
  });
});
