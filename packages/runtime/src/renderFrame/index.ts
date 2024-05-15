import { globalEventBus } from "../globalEventBus";
import { insertHtml } from "../utils/insertHtml";

export function renderFrame({
  leftPanelId,
  rightPanelId,
}: {
  leftPanelId: string;
  rightPanelId: string;
}): void {
  // 构建要插入的 HTML 字符串
  const htmlContent = `
    <div class="flex flex-col min-h-screen">
      <div id="top-panel" class="w-full bg-blue-500 p-4 text-white">
      </div>
      <div class="flex flex-1">
        <div id="${leftPanelId}" class="w-1/4 bg-gray-200 p-4">
        </div>
        <div id="main-content" class="flex-1 bg-white p-4">
          <div id='root'></div>
        </div>
        <div id="${rightPanelId}" class="w-1/4 bg-gray-200 p-4">
        </div>
      </div>
    </div>
  `;

  // 确保 document 已经准备好
  document.addEventListener("DOMContentLoaded", () => {
    // 使用 insertHtml 函数来插入 HTML 片段
    insertHtml("body", htmlContent);
    globalEventBus.emit("rightPanelMounted", {
      rightPanel: document.getElementById(rightPanelId)!,
    });
  });
}
