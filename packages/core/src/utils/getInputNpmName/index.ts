import { TechStack, TechType, DependencyTreeNodeJson } from "@/types";
import { getMajorVersion } from "widget-up-utils";

export const getInputNpmName = (stack: TechStack): string => {
  // 这是一个示例映射，用于将技术栈映射到入口文件
  const techStackMap: Record<
    TechType,
    (version: string) => {
      name: string;
    }
  > = {
    React: (version) => ({
      name: `widget-up-connector-react${getMajorVersion(version)}`,
    }),
    Vue: (version) => ({
      name: `widget-up-connector-vue${getMajorVersion(version)}`,
    }),
    JQuery: (version) => ({
      name: `widget-up-connector-jquery${getMajorVersion(version)}`,
    }),
  };

  const mapper = techStackMap[stack.name];
  if (!mapper) {
    throw new Error(`Unsupported tech stack: ${stack.name}`);
  }
  return mapper(stack.version.exact).name;
};
