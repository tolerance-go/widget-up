// 构建环境
export const BuildEnv = process.env.NODE_ENV;
export const BuildEnvIsDev = process.env.NODE_ENV === "development";
export const BuildEnvIsProd = process.env.NODE_ENV === "production";
export const BuildEnvIsTest = process.env.NODE_ENV === "test";

// 应用环境
export const AppEnv = process.env.APP_ENV;
