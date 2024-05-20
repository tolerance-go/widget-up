import { RollupOptions } from "rollup";
import { getRollupConfig } from "widget-up-core";

export default async () => {
  let rollupConfig: RollupOptions[] | RollupOptions = [];

  return getRollupConfig();
};
