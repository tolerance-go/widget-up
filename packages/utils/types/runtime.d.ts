import { DependencyTreeNodeJSON } from "./htmlDependencyManager";

export interface DemoMenuItem {
  globals: {
    component: string;
    connector: string;
  };
  name: string;
  children?: DemoMenuItem[];
}

export type StartParamsJSON = {
  dependencies: DependencyTreeNodeJSON[];
  widgetUpSchemaFormDependencyTree?: DependencyTreeNodeJSON[];
};
