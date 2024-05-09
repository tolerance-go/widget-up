import { PathManager } from "@/src/managers/getPathManager";
import { getGlobalNameWithDemo } from "@/src/utils/getGlobalNameWithDemo";
import { DemoData, DemoMenuItem } from "@/types";
import { NormalizedUMDConfig } from "widget-up-utils";

export const convertDemoDataToMenu = (
  demosData: DemoData[],
  umdConfig: NormalizedUMDConfig,
  pathManager: PathManager
): DemoMenuItem[] => {
  return demosData.map((demoData) => {
    const { config, children } = demoData;
    return {
      name: config.menuTitle,
      globals: {
        component: getGlobalNameWithDemo(demoData, umdConfig),
        register: `Register${config.menuTitle}Component`,
      },
      children: convertDemoDataToMenu(children || [], umdConfig, pathManager),
    };
  });
};
