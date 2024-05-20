import { RollupOptions } from "rollup";
import { getRollupConfig, EnvManager } from "widget-up-core";

export default async () => {
  let rollupConfig: RollupOptions[] | RollupOptions = [];

  const envManager = EnvManager.getInstance();

  const corePlgs = await getRollupConfig({
    processStartParams: (params) => {
      return {
        ...params,
        widgetUpSchemaFormDependencyTree: [],
      };
    },
  });

  return corePlgs;
};
