import "@/styles/index.less";
import { EventBus } from "widget-up-utils";
import { createEventBus } from "./createEventBus";
import { DependencyTreeNode, install } from "./install";
import { renderFrame } from "./renderFrame";
import { renderMenus } from "./renderMenus";

export const globalEventBus = createEventBus();

// export type JQueryComponentProps<T extends object> = { initialData?: any } & T;

// export const JQueryComponent = <T extends object = object>(
//   props: JQueryComponentProps<T>
// ): JQuery<HTMLElement> => {
//   throw new Error("runtime code");
// };

// export type HTMLComponentProps<T extends object> = { initialData?: any } & T;

// export const HTMLComponent = <T extends object = object>(
//   props: HTMLComponentProps<T>
// ): HTMLElement => {
//   throw new Error("runtime code");
// };

export const start = ({
  dependencies,
}: {
  dependencies: DependencyTreeNode[];
}) => {
  const leftPanelId = "leftPanel";
  renderFrame({
    leftPanelId,
  });
  // 请求跟目录下的 menus.json 然后渲染左边栏菜单
  renderMenus({ containerId: leftPanelId, eventBus: globalEventBus });

  install(dependencies, window.document, globalEventBus);
};
