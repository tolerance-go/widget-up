import { globalEventBus } from "./globalEventBus";
import { DependencyTreeNode, install } from "./install";
import { startRender } from "./registerRender";
import { renderFrame } from "./renderFrame";
import { renderMenus } from "./renderMenus";

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

  install(dependencies, window.document);

  startRender();
};
