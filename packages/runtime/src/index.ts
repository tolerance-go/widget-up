import "@/styles/index.less";
import { semverToIdentifier, getMajorVersion } from "widget-up-utils";

export { globalEventBus } from "./events";
export { start } from "./start";
export { createWindow } from "widget-up-utils";

export type { DependencyTreeNode } from "./install";

export const utils = {
  semverToIdentifier,
  getMajorVersion,
};
