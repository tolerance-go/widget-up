export const getEnv = () => {
  // 构建环境
  const BuildEnv = process.env.NODE_ENV;
  const BuildEnvIsDev = process.env.NODE_ENV === "development";
  const BuildEnvIsProd = process.env.NODE_ENV === "production";
  const BuildEnvIsTest = process.env.NODE_ENV === "test";

  // 应用环境
  const AppEnv = process.env.APP_ENV;

  return {
    BuildEnv,
    BuildEnvIsDev,
    BuildEnvIsProd,
    BuildEnvIsTest,
    AppEnv,
  };
};
