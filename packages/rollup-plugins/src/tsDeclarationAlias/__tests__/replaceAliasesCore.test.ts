import { replaceAliasesCore } from "../replaceAliasesCore";

describe("replaceAliasesCore", () => {
  it("should replace alias with correct relative paths", () => {
    const fileContent = "import MyClass from '@/myClass';";
    const paths = {
      "@/*": ["*"],
    };
    const baseUrl = "/root";
    const fileDir = "/root/dist";
    const mockResolvePath = jest.fn((relative) => `${baseUrl}/${relative}`);

    const expectedResult = "import MyClass from '../myClass';";
    const result = replaceAliasesCore({
      fileContent,
      paths,
      fileDir,
      resolvePath: mockResolvePath,
    });

    expect(result).toBe(expectedResult);
    expect(mockResolvePath).toHaveBeenCalledWith("");
  });

  // 测试嵌套路径;
  it("should replace nested directory paths correctly", () => {
    const fileContent =
      "import DeepComponent from '@/components/deep/DeepComponent';";
    const paths = {
      "@/*": ["src/*"],
    };
    const baseUrl = "/root";
    const fileDir = "/root/dist/pages";
    const mockResolvePath = jest.fn((relative) => `${baseUrl}/${relative}`);

    const expectedResult =
      "import DeepComponent from '../../src/components/deep/DeepComponent';";
    const result = replaceAliasesCore({
      fileContent,
      paths,
      fileDir,
      resolvePath: mockResolvePath,
    });

    expect(result).toBe(expectedResult);
    expect(mockResolvePath).toHaveBeenCalledWith("src/");
  });

  // 测试不包含别名的路径
  it("should not replace non-aliased import paths", () => {
    const fileContent = "import ExternalLib from 'external-lib';";
    const paths = {
      "@/*": ["src/*"],
    };
    const baseUrl = "/root";
    const fileDir = "/root/src";
    const mockResolvePath = jest.fn();

    const expectedResult = "import ExternalLib from 'external-lib';";
    const result = replaceAliasesCore({
      fileContent,
      paths,
      fileDir,
      resolvePath: mockResolvePath,
    });

    expect(result).toBe(expectedResult);
    expect(mockResolvePath).not.toHaveBeenCalled();
  });

  // it("should replace export alias with correct relative paths", () => {
  //   const fileContent = "export MyClass from '@/myClass';";
  //   const paths = { "@/*": ["*"] };
  //   const fileDir = "/root/dist";
  //   const mockResolvePath = jest.fn((relative) => `/root/${relative}`);

  //   const expectedResult = "export MyClass from '../myClass';";
  //   const result = replaceAliasesCore({
  //     fileContent,
  //     paths,
  //     fileDir,
  //     resolvePath: mockResolvePath,
  //   });

  //   expect(result).toBe(expectedResult);
  // });

  // it("should handle 'import type' with aliases correctly", () => {
  //   const fileContent = "import type { MyClass } from '@/myClass';";
  //   const paths = { "@/*": ["*"] };
  //   const fileDir = "/root/dist";
  //   const mockResolvePath = jest.fn((relative) => `/root/${relative}`);

  //   const expectedResult = "import type { MyClass } from '../myClass';";
  //   const result = replaceAliasesCore({
  //     fileContent,
  //     paths,
  //     fileDir,
  //     resolvePath: mockResolvePath,
  //   });

  //   expect(result).toBe(expectedResult);
  // });

  // it("should handle 'export type' with aliases correctly", () => {
  //   const fileContent = "export type { MyClass } from '@/myClass';";
  //   const paths = { "@/*": ["*"] };
  //   const fileDir = "/root/dist";
  //   const mockResolvePath = jest.fn((relative) => `/root/${relative}`);

  //   const expectedResult = "export type { MyClass } from '../myClass';";
  //   const result = replaceAliasesCore({
  //     fileContent,
  //     paths,
  //     fileDir,
  //     resolvePath: mockResolvePath,
  //   });

  //   expect(result).toBe(expectedResult);
  // });
});
