import { DependencyTreeNode } from "./dependency";

export type StartParams = {
  dependencies: DependencyTreeNode[];
  widgetUpSchemaFormDependencyTree?: DependencyTreeNode[];
};
