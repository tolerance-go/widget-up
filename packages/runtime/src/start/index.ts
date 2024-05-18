import { DependencyTreeNode, install } from "../install";
import { startRender } from "../connectorRender";
import { renderFrame } from "../renderFrame";
import { renderMenus } from "../renderMenus";
import {
  applyDependencies as renderSettingsApplyDependencies,
  renderSettings,
} from "../renderSettings";
import { FormSchemaConfig } from "widget-up-utils";
import { identifierManager } from "../identifierManager";

export const start = ({
  dependencies,
}: {
  dependencies: DependencyTreeNode[];
  initialValues: Record<string, any>;
  formSchema: FormSchemaConfig;
}) => {
  const leftPanelId = identifierManager.leftPanelId;
  const rightPanelId = identifierManager.rightPanelId;
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
