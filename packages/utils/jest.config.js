import { pathsToModuleNameMapper } from "ts-jest";
import tsconfig from "./tsconfig.json" assert { type: "json" };

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest/presets/default-esm",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    /**
     * 映射字符串 '$1' 表示将匹配到的路径（去掉了 .js 后缀）
     * 直接用作新的模块路径。这样做的原因是在使用 TypeScript 和 ES 模块时，
     * 可能会遇到实际文件以 .ts 或 .tsx 为扩展名，但在代码中错误地使用了 .js 扩展名进行引用。
     * 这个配置确保了即使你在 TypeScript 项目中错误地引用了 .js 结尾的模块，
     * Jest 也能通过去掉 .js 后缀，正确地定位到 .ts 或 .tsx 文件。
     */
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/__tests__"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  transform: {
    "^.+\\.(t|j)sx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
        useESM: true,
      },
    ],
  },
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  moduleFileExtensions: ["ts", "js", "json", "node"],
  testPathIgnorePatterns: ["<rootDir>/__tests__/_utils/"],
};
