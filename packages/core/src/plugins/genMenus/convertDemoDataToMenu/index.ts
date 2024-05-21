import { PathManager } from "@/src/managers/pathManager";
import { getGlobalNameWithDemo } from "@/src/utils/getGlobalNameWithDemo";
import { DemoData, DemoMenuItem } from "@/types";
import {
  NormalizedUMDConfig,
  PackageJson,
  findOnlyFrameworkModule,
  semverToIdentifier,
} from "widget-up-utils";

export const convertDemoDataToMenu = (
  demosData: DemoData[],
  umdConfig: NormalizedUMDConfig,
  packageConfig: PackageJson,
  pathManager: PathManager
): DemoMenuItem[] => {
  const frameworkModule = findOnlyFrameworkModule({
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
