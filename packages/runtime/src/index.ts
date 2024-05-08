import "@/styles/index.less";
import { semverToIdentifier } from "widget-up-utils";

export { globalEventBus } from "./globalEventBus";
export { start } from "./start";
export { createWindow } from "widget-up-utils";

export type { DependencyTreeNode } from "./install";

export const utils = {
  semverToIdentifier,
};
