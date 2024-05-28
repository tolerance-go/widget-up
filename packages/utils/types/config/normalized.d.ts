import { FormSchemaConfig } from "../form";
import { ScopeObjectName } from "../wrapUMDAliasCode";
import { BrowserEntry, CSSModuleType, StyleEntry } from "./base";
import { ExternalConfig, GlobalsSchemaConfig } from "./schema";

export type NormalizedUMDConfig = {
  name: string;
  external: ExternalConfig;
  globals: GlobalsSchemaConfig;
  browser: BrowserEntry;
  style?: StyleEntry;
  exportScopeObjectName: ScopeObjectName;
  importScopeObjectName: ScopeObjectName;
  extraPeerDependencies?: Record<string, string>;
};

export type NormalizedDependenciesUMDConfig = Record<
  string,
  NormalizedUMDConfig
>;

export interface NormalizedConfig {
  input: string;
  umd: NormalizedDependenciesUMDConfig;
  cjs: boolean;
  esm: boolean;
  css: boolean | CSSModuleType;
  form: FormSchemaConfig;
}
