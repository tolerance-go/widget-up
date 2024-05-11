import { PathManager } from "@/src/managers/getPathManager";
import { detectTechStack } from "@/src/utils/detectTechStack";
import { getGlobalNameWithDemo } from "@/src/utils/getGlobalNameWithDemo";
import { getInputGlobalName } from "@/src/utils/getInputGlobalName";
import { DemoData, DemoMenuItem } from "@/types";
import {
  NormalizedUMDConfig,
  PackageJson,
  semverToIdentifier,
} from "widget-up-utils";

export const convertDemoDataToMenu = (
  demosData: DemoData[],
  umdConfig: NormalizedUMDConfig,
  packageConfig: PackageJson,
  pathManager: PathManager
): DemoMenuItem[] => {
  return demosData.map((demoData) => {
    const { config, children } = demoData;
    return {
      name: config.menuTitle,
      globals: {
        component: `${getGlobalNameWithDemo(
          demoData,
          umdConfig,
          pathManager.demosAbsPath
        )}_${semverToIdentifier(packageConfig.version)}`,
        register: getInputGlobalName(detectTechStack()),
      },
      children: convertDemoDataToMenu(
        children || [],
        umdConfig,
        packageConfig,
        pathManager
      ),
    };
  });
};
