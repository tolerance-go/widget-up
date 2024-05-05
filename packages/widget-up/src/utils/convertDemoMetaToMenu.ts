/**
 * 是什么
 *
 * - 将 demoMeta 转换为 menu
 */

import { DemoMenuItem, DemoMeta } from "@/types";

export const convertDemoMetaToMenu = (
  demoMetas: DemoMeta[]
): DemoMenuItem[] => {
  return demoMetas.map((item) => {
    if (item.type === "file") {
      return {
        name: item.config?.name || "",
        globals: item.config && {
          component: item.config.globals.component,
          register: item.config.globals.register,
        },
      };
    }

    return {
      name: item.config?.name || "",
      globals: item.config && {
        component: item.config.globals.component,
        register: item.config.globals.register,
      },
      children: convertDemoMetaToMenu(item.children ?? []),
    };
  });
};
