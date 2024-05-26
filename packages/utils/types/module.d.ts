export type ResolvedModuleInfo = ModuleEntryPathData & {
  packageJSON: PackageConfig;
};

export type ModuleEntryPathData = {
  modulePath: string;
  moduleEntryAbsPath: string;
  moduleStyleEntryAbsPath?: string;
  moduleBrowserEntryAbsPath?: string;
  moduleEntryRelPath: string;
  moduleStyleEntryRelPath?: string;
  moduleBrowserEntryRelPath?: string;
};

export interface PackageConfig {
  name: string;
  version: string;
  description?: string;
  style?: string;
  browser?: string;
  main?: string;
  types?: string;
  typings?: string; // 同types
  scripts?: { [key: string]: string };
  repository?: {
    type: string;
    url: string;
  };
  keywords?: string[];
  author?: string;
  contributors?:
    | string[]
    | Array<{
        name: string;
        email?: string;
        url?: string;
      }>;
  license?: string;
  bugs?: {
    url: string;
    email?: string;
  };
  homepage?: string;
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
  peerDependencies?: { [key: string]: string };
  optionalDependencies?: { [key: string]: string };
  engines?: {
    node?: string;
    npm?: string;
  };
  os?: string[];
  cpu?: string[];
  private?: boolean;
  publishConfig?: {
    registry?: string;
    access?: "public" | "restricted";
  };
}
