// renderMenus.ts
import { AppEvents } from "@/types";
import {
  DemoMenuItem,
  EventBus,
  getURLSearchParams,
  updateURLParameters,
} from "widget-up-utils";
import {
  replaceGlobalConnector,
  replaceRuntimeComponent,
  triggerGlobalCompUpdate,
} from "../connectorRender";
import { insertHtml } from "../utils/insertHtml";
import { runtimeLogger } from "../utils/logger";
import { findMenuItemByName } from "./findMenuItemByName";
import { globalEventBus } from "..";

interface RenderMenusOptions {
  containerId: string;
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
        }" data-global-connector-render="${
          item.globals?.connector
        }" class="text-blue-500 hover:text-blue-700">${item.name}</a>
          ${childrenHtml}
        </li>`;
      })
      .join("");
  };

  return `<ul class="list-none">${buildMenuItems(menus)}</ul>`;
}

export async function renderMenus({
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
        globalEventBus.emit("menuClick", {
          name: target.dataset.name,
          globals: {
            component: target.dataset.globalComponent || "",
            connector: target.dataset.globalConnectorRender || "",
          },
        });
      }
    });

    globalEventBus.on("menuClick", ({ globals, name }) => {
      updateURLParameters({
        name,
      });

      runtimeLogger.log(
        "menuClick",
        JSON.stringify({ globals, name }, null, 2)
      );

      // 监听菜单点击，然后动态把全局的 Component 组件替换为
      const component = (window as any)[globals.component].default;
      const connector = (window as any)[globals.connector];

      if (connector) {
        replaceGlobalConnector(connector.render, connector.unmount);

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

    globalEventBus.on("allScriptsExecuted", () => {
      /**
       * 从 url 参数获取当前 name，如果存在
       * 手动触发一次 menuClick
       */
      const params = getURLSearchParams(location.href);

      if (params.name) {
        const item = findMenuItemByName(menus, params.name);
        if (item) {
          globalEventBus.emit("menuClick", {
            name: item.name,
            globals: {
              component: item.globals.component,
              connector: item.globals.connector,
            },
          });
        }
      }
    });
  } catch (error) {
    console.error("Error rendering menus:", error);
  }
}
