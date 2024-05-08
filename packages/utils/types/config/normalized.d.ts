import { FormSchemaConfig } from "../form";
import { CSSModuleType } from "./base";
import { GlobalsSchemaConfig } from "./schema";

export interface NormalizedConfig {
  input: string;
  umd: NormalizedUMDConfig;
  cjs?: boolean;
  esm?: boolean;
  css?: boolean | CSSModuleType;
  form?: FormSchemaConfig;
}

export interface NormalizedUMDConfig {
  name: string;
  external: string[];
  globals: GlobalsSchemaConfig;
  dependenciesEntries: NormalizedUMDDependenciesEntries;
}

export type NormalizedUMDDependenciesEntries = Record<
  string,
  {
    development: string;
    production: string;
  }
>;
