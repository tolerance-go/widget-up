import { DependencyTreeNode } from "widget-up-utils";

export type StartParams = {
  dependencies: DependencyTreeNode[];
  widgetUpSchemaFormDependencyTree?: DependencyTreeNode[];
};
