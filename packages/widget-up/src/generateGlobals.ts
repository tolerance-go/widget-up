import {
  ParseConfig
} from "widget-up-utils";

export async function generateGlobals(config: ParseConfig) {
  return config.umd.globals;
}
