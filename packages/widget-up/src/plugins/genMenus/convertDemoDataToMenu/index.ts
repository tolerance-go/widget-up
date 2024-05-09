import { getGlobalNameWithDemo } from "@/src/utils/getGlobalNameWithDemo";
import { DemoData, DemoMenuItem } from "@/types";
import { PackageJson } from "widget-up-utils";

export const convertDemoDataToMenu = (
  demosData: DemoData[],
  packageConfig: PackageJson
): DemoMenuItem[] => {
  return demosData.map((demoData) => {
    const { config, children } = demoData;
    return {
      name: config.name,
      globals: {
        component: getGlobalNameWithDemo(demoData, packageConfig),
        register: `Register${config.name}Component`,
      },
      children: convertDemoDataToMenu(children || [], packageConfig),
    };
  });
};
