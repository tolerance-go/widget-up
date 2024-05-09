import { DependencyTreeNode } from "widget-up-runtime";
import { VersionData } from "widget-up-utils";

export type { DemoMenuItem } from "widget-up-utils";

export * from "./demoFileMeta";

export type TechType = "React" | "Vue" | "JQuery";

export type TechStack = {
  name: TechType;
  version: VersionData;
};

/**
 * DependencyTreeNode 的变体，
 * scriptSrc 和 linkHref 类型是字符串
 */
export type DependencyTreeNodeJson = Omit<
  DependencyTreeNode,
  "scriptSrc" | "linkHref" | 'depends'
> & {
  scriptSrc: string;
  linkHref: string;
  depends?: DependencyTreeNodeJson[];
};
