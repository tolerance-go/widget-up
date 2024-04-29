// renderMenus.ts
import { AppEvents } from "../createEventBus";
import { insertHtml } from "../utils/insertHtml";
import type { EventBus, MenuItem } from "widget-up-utils";

interface RenderMenusOptions {
  containerId: string;
  eventBus: EventBus<AppEvents>;
}

async function fetchMenus(): Promise<MenuItem[]> {
  const response = await fetch("/menus.json");
  if (!response.ok) {
    throw new Error("Failed to fetch menus");
  }
  return response.json();
}

function buildMenuHtml(menus: MenuItem[]): string {
  const buildMenuItems = (items: MenuItem[]): string => {
    return items
      .map((item) => {
        const childrenHtml = item.children
          ? `<ul class="ml-4">${buildMenuItems(item.children)}</ul>`
          : "";
        return `<li class="${childrenHtml ? "mb-2" : ""}">
          <a data-id="${item.name}" class="text-blue-500 hover:text-blue-700">${item.name}</a>
          ${childrenHtml}
        </li>`;
      })
      .join("");
  };

  return `<ul class="list-none">${buildMenuItems(menus)}</ul>`;
}

export async function renderMenus({
  eventBus,
  containerId,
}: RenderMenusOptions): Promise<void> {
  try {
    const menus = await fetchMenus();
    const html = buildMenuHtml(menus);
    insertHtml(`#${containerId}`, html);

    const container = document.getElementById(containerId);

    /**
     * 监听容器内的菜单的点击，然后派发事件
     */
    // 为容器内的所有菜单项绑定点击事件监听器
    container?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "A" && target.dataset.id) {
        eventBus.emit("menuClick", { id: target.dataset.id });
      }
    });
  } catch (error) {
    console.error("Error rendering menus:", error);
  }
}
