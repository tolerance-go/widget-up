import { BuildEnv } from "@/types";

export class BaseEnvManager {
  private static instance: BaseEnvManager;

  public BuildEnv: BuildEnv;
  public BuildEnvIsDev: boolean;
  public BuildEnvIsProd: boolean;
  public RuntimeEnv: string | undefined;

  public static getInstance(): BaseEnvManager {
    if (!BaseEnvManager.instance) {
      BaseEnvManager.instance = new BaseEnvManager();
    }
    return BaseEnvManager.instance;
  }

  constructor() {
    this.BuildEnv = process.env.NODE_ENV as BuildEnv;
    this.BuildEnvIsDev = this.BuildEnv === "development";
    this.BuildEnvIsProd = this.BuildEnv === "production";
    this.RuntimeEnv = process.env.RUNTIME_ENV;
  }
}
