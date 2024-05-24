import { PathManager } from "@/src/managers/pathManager";
import { getGlobalNameWithDemo } from "@/src/utils/getGlobalNameWithDemo";
import { DemoData, DemoMenuItem } from "@/types";
import {
  NormalizedUMDConfig,
  PackageConfig,
  findOnlyFrameworkModuleConfig,
  semverToIdentifier,
} from "widget-up-utils";

export const convertDemoDataToMenu = (
  demosData: DemoData[],
  umdConfig: NormalizedUMDConfig,
  packageConfig: PackageConfig,
  pathManager: PathManager
): DemoMenuItem[] => {
  const frameworkModule = findOnlyFrameworkModuleConfig({
    cwd: pathManager.cwdPath,
  });

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
        connector: `Connector_${frameworkModule.name}`,
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
