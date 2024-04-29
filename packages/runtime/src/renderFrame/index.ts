import { insertHtml } from "../utils/insertHtml";

export function renderFrame(): void {
  // 构建要插入的 HTML 字符串
  const htmlContent = `
    <div class="flex flex-col min-h-screen">
      <div id="top-panel" class="w-full bg-blue-500 p-4 text-white">
        <h1 class="text-2xl font-bold">顶部区域</h1>
      </div>
      <div class="flex flex-1">
        <div id="left-panel" class="w-1/4 bg-gray-200 p-4">
          <h1 class="text-xl font-bold">左侧区域</h1>
        </div>
        <div id="main-content" class="flex-1 bg-white p-4">
          <h1 class="text-2xl font-bold">中间区域</h1>
        </div>
        <div id="right-panel" class="w-1/4 bg-gray-200 p-4">
          <h1 class="text-xl font-bold">右侧区域</h1>
        </div>
      </div>
    </div>
  `;

  // 确保 document 已经准备好
  document.addEventListener("DOMContentLoaded", () => {
    // 使用 insertHtml 函数来插入 HTML 片段
    insertHtml("body", htmlContent);
  });
}
