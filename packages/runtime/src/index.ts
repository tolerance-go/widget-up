import { EventBus, HTMLDependencyManager } from "widget-up-utils";
import "@/styles/index.less";
import { renderFrame } from "./renderFrame";
import { renderMenus } from "./renderMenus";
import { createEventBus } from "./createEventBus";

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

export const start = () => {
  const eventBus = createEventBus();
  const leftPanelId = "leftPanel";
  renderFrame({
    leftPanelId,
  });
  renderMenus({ containerId: leftPanelId, eventBus });

  // 请求跟目录下的 menus.json 然后渲染左边栏菜单
};

export const install = async () => {
  const manager = new HTMLDependencyManager({
    fetchVersionList: async (dependencyName: string) => {
      const versions: Record<string, string[]> = {
        react: ["16.8.0", "16.13.1", "17.0.0"],
        "react-dom": ["16.8.0", "16.13.1", "17.0.0"],
        redux: ["4.0.4", "4.0.5", "4.1.0"],
        lodash: ["4.17.15", "4.17.19"],
        moment: ["2.24.0", "2.25.0"],
        "react-router": ["5.1.2", "5.2.0"],
        axios: ["0.19.0", "0.21.1"],
        "redux-thunk": ["2.3.0", "2.4.0"],
      };

      return versions[dependencyName];
    },
    document: window.document,
    scriptSrcBuilder: (dep) => {
      return "";
    },
    linkHrefBuilder: (dep) => {
      return "";
    },
  });

  await manager.addDependency("redux", "^4.0.5", {
    react: "^17.0.0", // Second level
    "redux-thunk": "^2.3.0", // Second level
  });
};
