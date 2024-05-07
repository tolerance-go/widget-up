export const getEnv = () => {
  // 构建环境
  const BuildEnv = process.env.NODE_ENV as "development" | "production";
  const BuildEnvIsDev = process.env.NODE_ENV === "development";
  const BuildEnvIsProd = process.env.NODE_ENV === "production";

  // 应用环境
  const AppEnv = process.env.APP_ENV;

  return {
    BuildEnv,
    BuildEnvIsDev,
    BuildEnvIsProd,
    AppEnv,
  };
};
