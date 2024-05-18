import { startRender } from "../connectorRender";
import { identifierManager } from "../identifierManager";
import { DependencyTreeNode, install } from "../install";
import { renderFrame } from "../renderFrame";
import { renderMenus } from "../renderMenus";
import {
  renderSettings,
  applyDependencies as renderSettingsApplyDependencies,
} from "../renderSettings";

export const start = ({
  dependencies,
  widgetUpSchemaFormDependencyTree,
}: {
  dependencies: DependencyTreeNode[];
  widgetUpSchemaFormDependencyTree?: DependencyTreeNode[];
}) => {
  const leftPanelId = identifierManager.leftPanelId;
  const rightPanelId = identifierManager.rightPanelId;
  renderFrame({
    leftPanelId,
    rightPanelId,
  });
  // 请求跟目录下的 menus.json 然后渲染左边栏菜单
  renderMenus({ containerId: leftPanelId });

  dependencies = renderSettingsApplyDependencies(
    dependencies,
    widgetUpSchemaFormDependencyTree
  );

  install(dependencies, window.document);

  renderSettings();

  startRender();
};
