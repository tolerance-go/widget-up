import * as sass from "sass";
import { logger } from "./logger";

/**
 * 将 CSS 内容包裹在一个外部类中，并使用 Sass 编译
 * @param cssContent - 需要包裹和编译的 CSS 内容
 * @param outerClass - 用于包裹 CSS 内容的外部类
 * @returns 返回一个 Promise，解析为编译后的 CSS 字符串
 */
export async function compileCssWithOuterClass(
  cssContent: string,
  outerClass: string
): Promise<string> {
  // 将 CSS 内容包裹在外部类中
  const wrappedCss = `.${outerClass} {\n${cssContent}\n}`;

  try {
    // 使用 Sass 编译包裹后的 CSS
    const result = sass.compileString(wrappedCss);

    // 返回编译后的 CSS
    return result.css;
  } catch (error) {
    logger.error("编译 CSS 失败", {
      cssContent,
      outerClass,
    });

    if (error instanceof Error) {
      throw new Error(`编译 CSS 失败: ${error.message}`);
    } else {
      throw new Error(`编译 CSS 失败: 未知错误`);
    }
  }
}
