// renderMenus.ts
import { AppEvents } from "@/types";
import type { EventBus, DemoMenuItem } from "widget-up-utils";
import {
  replaceGlobalRegister,
  replaceRuntimeComponent,
  triggerGlobalCompUpdate,
} from "../registerRender";
import { insertHtml } from "../utils/insertHtml";

interface RenderMenusOptions {
  containerId: string;
  eventBus: EventBus<AppEvents>;
}

async function fetchMenus(): Promise<DemoMenuItem[]> {
  const response = await fetch("/menus.json");
  if (!response.ok) {
    throw new Error("Failed to fetch menus");
  }
  return response.json();
}

function buildMenuHtml(menus: DemoMenuItem[]): string {
  const buildMenuItems = (items: DemoMenuItem[]): string => {
    return items
      .map((item) => {
        const childrenHtml = item.children
          ? `<ul class="ml-4">${buildMenuItems(item.children)}</ul>`
          : "";
        return `<li class="${childrenHtml ? "mb-2" : ""}">
          <a data-name="${item.name}" data-global-component="${
          item.globals?.component
        }" data-global-register-render="${
          item.globals?.register
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
      if (target.tagName === "A" && target.dataset.name) {
        eventBus.emit("menuClick", {
          name: target.dataset.name,
          globals: {
            component: target.dataset.globalComponent || "",
            register: target.dataset.globalRegisterRender || "",
          },
        });
      }
    });

    eventBus.on("menuClick", ({ globals, name }) => {
      console.log("menuClick", globals, name);

      // 监听菜单点击，然后动态把全局的 Component 组件替换为
      const component = (window as any)[globals.component].default;
      const register = (window as any)[globals.register];

      if (register) {
        replaceGlobalRegister(register.render, register.unmount);

        if (component) {
          replaceRuntimeComponent(component);
          triggerGlobalCompUpdate();
        } else {
          console.error(
            `Global component ${globals.component} not found on window`
          );
        }
      }
    });
  } catch (error) {
    console.error("Error rendering menus:", error);
  }
}
