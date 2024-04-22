import { ParseConfig } from "widget-up-utils";

export function generateGlobals(config: ParseConfig) {
  return config.umd.globals;
}
