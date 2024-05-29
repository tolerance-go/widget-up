import { compileCssWithOuterClass } from ".";

describe("compileCssWithOuterClass", () => {
  test("正确编译并包裹 CSS 内容", async () => {
    const cssContent = `
            .example {
                color: red;
            }
        `;
    const outerClass = "my-outer-class";

    const expectedOutput = `
.my-outer-class .example {
  color: red;
}
`.trim();

    const compiledCss = await compileCssWithOuterClass(cssContent, outerClass);
    expect(compiledCss.trim()).toBe(expectedOutput);
  });

  test("处理无效的 CSS 内容", async () => {
    const cssContent = `
            .example {
                color: red
        `;
    const outerClass = "my-outer-class";

    await expect(
      compileCssWithOuterClass(cssContent, outerClass)
    ).rejects.toThrow("编译 CSS 失败");
  });
});
