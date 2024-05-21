import { DependencyListItem } from "./htmlDependencyManager";

// 定义一个类型来表示依赖树的节点
export interface DependencyTreeNode {
  name: string;
  version: string;
  scriptSrc?: (dep: DependencyListItem) => string;
  linkHref?: (dep: DependencyListItem) => string;
  depends?: DependencyTreeNode[];
}

/**
 * DependencyTreeNode 的变体，
 * scriptSrc 和 linkHref 类型是字符串
 */
export type DependencyTreeNodeJSON = Omit<
  DependencyTreeNode,
  "scriptSrc" | "linkHref" | "depends"
> & {
  scriptSrc: string;
  linkHref: string;
  depends?: DependencyTreeNodeJSON[];
};

export type StartParamsJSON = {
  dependencies: DependencyTreeNodeJSON[];
  widgetUpSchemaFormDependencyTree?: DependencyTreeNodeJSON[];
};
