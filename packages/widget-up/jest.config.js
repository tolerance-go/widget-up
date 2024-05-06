/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm',
  // jest 已经通过 node --experimental-vm-modules 开启了 ESM 支持
  // 我们使用 ts 开发，内部需要指定 .ts 文件为 ESM
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
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
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
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
