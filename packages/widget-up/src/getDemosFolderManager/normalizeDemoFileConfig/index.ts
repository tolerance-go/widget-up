import { DemoFileConfig, DemoFileNormalizedConfig } from "@/types";

export const normalizeDemoFileConfig = (
  config: DemoFileConfig
): DemoFileNormalizedConfig => {
  return {
    name: config.name || "Demo",
    globals: {
      component: config.globals?.component || "Component",
      register: config.globals?.register || "register",
    },
  };
};
