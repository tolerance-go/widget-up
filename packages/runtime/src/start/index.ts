import { StartParams } from "@/types/start";
import { startRender } from "../modules/connectorRender";
import { identifierManager } from "../managers/identifierManager";
import { install } from "../modules/install";
import { renderFrame } from "../modules/renderFrame";
import { renderMenus } from "../modules/renderMenus";
import {
  renderSettings,
  applyDependencies as renderSettingsApplyDependencies,
} from "../modules/renderSettings";
import { EnvManager } from "../managers/envManager";

export const start = ({ dependencies }: StartParams) => {
  const envManager = EnvManager.getInstance();

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
    envManager.BuildEnv
  );

  install(dependencies, window.document);

  renderSettings();

  startRender();
};
