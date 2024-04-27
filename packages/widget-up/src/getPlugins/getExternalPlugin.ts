import { OutputOptions } from "rollup";
import {
  autoExternalDependencies,
  peerDependenciesAsExternal,
} from "widget-up-utils";

export const getExternalPlugin = (format: OutputOptions["format"]) => {
  if (format === "cjs" || format === "esm") {
    return autoExternalDependencies();
  }
  if (format === "umd") {
    return peerDependenciesAsExternal();
  }
  return null;
};
