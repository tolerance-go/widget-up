import { DependencyTreeNode } from "widget-up-runtime";
import { VersionData } from "widget-up-utils";

export type { DemoMenuItem } from "widget-up-utils";

/**
 * # 是什么
 *
 * - Demo 入口配置
 *
 * # 解决什么需求
 *
 * - 根据它生成 runtimeRollup 的插件数组，动态构建 demo 组件
 */
export type DemoInput = {
  name: string;
  path: string;
};

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
