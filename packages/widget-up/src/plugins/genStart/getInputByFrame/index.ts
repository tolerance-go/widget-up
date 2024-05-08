import { getMajorVersion } from "@/src/utils/getMajorVersion";
import { TechStack, TechType } from "@/types";
import { DependencyTreeNode } from "widget-up-runtime";

// 这是一个示例映射，用于将技术栈映射到入口文件
const techStackMap: Record<TechType, (version: string) => DependencyTreeNode> =
  {
    React: (version) => ({
      name: `widget-up-input-react${getMajorVersion(version)}`,
      version,
      scriptSrc: () => `/libs/input.react${getMajorVersion(version)}.js`,
      depends: [],
    }),
    Vue: (version) => ({
      name: `widget-up-input-vue${getMajorVersion(version)}`,
      version,
      scriptSrc: () => `/libs/input.vue${getMajorVersion(version)}.js`,
      depends: [],
    }),
    JQuery: (version) => ({
      name: `widget-up-input-jquery${getMajorVersion(version)}`,
      version,
      scriptSrc: () => `/libs/input.jquery${getMajorVersion(version)}.js`,
      depends: [],
    }),
  };

export function getInputByFrame(stacks: TechStack[]): DependencyTreeNode[] {
  return stacks.map((stack) => {
    const mapper = techStackMap[stack.name];
    if (!mapper) {
      throw new Error(`Unsupported tech stack: ${stack.name}`);
    }
    return mapper(stack.version.exact);
  });
}
