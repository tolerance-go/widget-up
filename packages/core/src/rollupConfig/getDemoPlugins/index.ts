import { DemoManager } from "@/src/managers/demoManager";

export const getDemoPlugins = () => {
  const demoManager = DemoManager.getInstance();

  const demoList = demoManager.getDemoList();
};
