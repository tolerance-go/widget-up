import { VersionData } from "widget-up-utils";

export type { DemoMenuItem } from "widget-up-utils";

export * from "./demoFileMeta";

export type TechType = "React" | "Vue" | "JQuery";

export type TechStack = {
  name: TechType;
  version: VersionData;
};
