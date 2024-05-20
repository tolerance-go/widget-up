export class EnvManager {
  private static instance: EnvManager;

  public BuildEnv: "development" | "production";
  public BuildEnvIsDev: boolean;
  public BuildEnvIsProd: boolean;
  public RuntimeEnv: string | undefined;

  private constructor() {
    this.BuildEnv = process.env.NODE_ENV as "development" | "production";
    this.BuildEnvIsDev = this.BuildEnv === "development";
    this.BuildEnvIsProd = this.BuildEnv === "production";
    this.RuntimeEnv = process.env.APP_ENV;
  }

  public static getInstance(): EnvManager {
    if (!EnvManager.instance) {
      EnvManager.instance = new EnvManager();
    }
    return EnvManager.instance;
  }
}
