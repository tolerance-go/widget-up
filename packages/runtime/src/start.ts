import { DependencyTreeNode, install } from "./install";
import { startRender } from "./connectorRender";
import { renderFrame } from "./renderFrame";
import { renderMenus } from "./renderMenus";
import {
  applyDependencies as renderSettingsApplyDependencies,
  renderSettings,
} from "./renderSettings";

export const start = ({
  dependencies,
}: {
  dependencies: DependencyTreeNode[];
}) => {
  const leftPanelId = "leftPanel";
  const rightPanelId = "rightPanel";
  renderFrame({
    leftPanelId,
    rightPanelId,
  });
  // 请求跟目录下的 menus.json 然后渲染左边栏菜单
  renderMenus({ containerId: leftPanelId });

  dependencies = renderSettingsApplyDependencies(dependencies);

  install(dependencies, window.document);

  renderSettings();

  startRender();
};
