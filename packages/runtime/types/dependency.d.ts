import { DependencyListItem } from "widget-up-utils";

// 定义一个类型来表示依赖树的节点
export interface DependencyTreeNode {
  name: string;
  version: string;
  scriptSrc?: (dep: DependencyListItem) => string;
  linkHref?: (dep: DependencyListItem) => string;
  depends?: DependencyTreeNode[];
}
