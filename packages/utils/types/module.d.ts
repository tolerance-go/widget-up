import { PackageConfig } from "./package";

export type ResolvedModuleInfo = ModuleEntryPathData & {
  packageJson: PackageConfig;
};

export type ModuleEntryPathData = {
  modulePath: string;
  moduleEntryPath: string;
  moduleStyleEntryPath?: string;
  moduleBrowserEntryPath?: string;
};
