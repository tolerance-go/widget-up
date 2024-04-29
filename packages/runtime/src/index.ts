import { EventBus, HTMLDependencyManager } from "widget-up-utils";
import "@/styles/index.less";
import { renderFrame } from "./renderFrame";
import { renderMenus } from "./renderMenus";
import { createEventBus } from "./createEventBus";
import { install, DependencyTreeNode } from "./install";

export type GlobalEvents = {
  onClickMenuItem: {
    key: string;
  };
};

export const globalEventBus = new EventBus<GlobalEvents>();

export type JQueryComponentProps<T extends object> = { initialData?: any } & T;

export const JQueryComponent = <T extends object = object>(
  props: JQueryComponentProps<T>
): JQuery<HTMLElement> => {
  throw new Error("runtime code");
};

export type HTMLComponentProps<T extends object> = { initialData?: any } & T;

export const HTMLComponent = <T extends object = object>(
  props: HTMLComponentProps<T>
): HTMLElement => {
  throw new Error("runtime code");
};

export const start = ({
  dependencies,
}: {
  dependencies: DependencyTreeNode[];
}) => {
  const eventBus = createEventBus();
  const leftPanelId = "leftPanel";
  renderFrame({
    leftPanelId,
  });
  // 请求跟目录下的 menus.json 然后渲染左边栏菜单
  renderMenus({ containerId: leftPanelId, eventBus });

  install(dependencies, window.document);
};
