import { FormSchemaConfig } from "../form";
import { ScopeObjectName } from "../wrapUMDAliasCode";
import { CSSModuleType, StyleEntry } from "./base";
import {
  BrowserEntry,
  ExternalConfig,
  GlobalsSchemaConfig
} from "./schema";

export type NormalizedExternalDependency = {
  name: string;
  external: ExternalConfig;
  globals: GlobalsSchemaConfig;
  browser: BrowserEntry;
  style?: StyleEntry;
  exportScopeObjectName: ScopeObjectName;
};

export interface NormalizedUMDConfig {
  name: string;
  external: ExternalConfig;
  globals: GlobalsSchemaConfig;
  externalDependencies: NormalizedExternalDependencies;
}

export type NormalizedExternalDependencies = Record<
  string,
  NormalizedExternalDependency
>;

export interface NormalizedConfig {
  input: string;
  umd: NormalizedUMDConfig;
  cjs: boolean;
  esm: boolean;
  css: boolean | CSSModuleType;
  form: FormSchemaConfig;
}
