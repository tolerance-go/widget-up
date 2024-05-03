// renderMenus.ts
import { AppEvents } from "@/types";
import {
  replaceRegisterRender,
  replaceRuntimeComponent,
  triggerGlobalCompUpdate,
} from "../registerRender";
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
          <a data-name="${item.name}" data-globalComponent="${
          item.globals.component
        }" data-globalRegisterRender="${
          item.globals.registerRender
        }" class="text-blue-500 hover:text-blue-700">${item.name}</a>
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
      if (
        target.tagName === "A" &&
        target.dataset.name &&
        target.dataset.global
      ) {
        eventBus.emit("menuClick", {
          name: target.dataset.name,
          globals: {
            component: target.dataset.globalComponent || '',
            registerRender: target.dataset.globalRegisterRender || ''
          },
        });
      }
    });

    eventBus.on("menuClick", ({ globals, name }) => {
      // 监听菜单点击，然后动态把全局的 Component 组件替换为
      const component = (window as any)[globals.component];
      const registerRender = (window as any)[globals.registerRender];

      console.log("menuClick and find component", globals, component, registerRender);

      if (registerRender) {
        replaceRegisterRender(registerRender);
      }

      if (component) {
        replaceRuntimeComponent(component);
        triggerGlobalCompUpdate();
      } else {
        console.error(`Global component ${globals.component} not found on window`);
      }
    });
  } catch (error) {
    console.error("Error rendering menus:", error);
  }
}
