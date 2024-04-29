/**
 * 将 HTML 片段插入到指定的 DOM 元素中。
 * @param {string} selector - 目标元素的选择器。
 * @param {string} html - 要插入的 HTML 字符串。
 * @param {string} position - 插入位置，可以是 'beforebegin', 'afterbegin', 'beforeend', 'afterend'。
 */
export function insertHtml(
  selector: string,
  html: string,
  position: InsertPosition = "beforeend"
): void {
  const element = document.querySelector(selector);
  if (element) {
    element.insertAdjacentHTML(position, html);
  } else {
    console.error(`No element found with selector: ${selector}`);
  }
}
