import { InputNpmManager } from "@/src/getInputNpmManager";
import { getMajorVersion } from "@/src/utils/getMajorVersion";
import { TechStack, TechType } from "@/types";
import { DependencyTreeNode } from "widget-up-runtime";

export function getInputByFrame(
  stacks: TechStack[],
  inputNpmManager: InputNpmManager
): DependencyTreeNode[] {
  // 这是一个示例映射，用于将技术栈映射到入口文件
  const techStackMap: Record<
    TechType,
    (version: string) => DependencyTreeNode
  > = {
    React: (version) => ({
      name: `widget-up-input-react${getMajorVersion(version)}`,
      version: inputNpmManager.getInputByName(
        `widget-up-input-react${getMajorVersion(version)}`
      ).packageJson.version,
      scriptSrc: () => `/libs/input.react${getMajorVersion(version)}.js`,
      depends: [],
    }),
    Vue: (version) => ({
      name: `widget-up-input-vue${getMajorVersion(version)}`,
      version: inputNpmManager.getInputByName(
        `widget-up-input-vue${getMajorVersion(version)}`
      ).packageJson.version,
      scriptSrc: () => `/libs/input.vue${getMajorVersion(version)}.js`,
      depends: [],
    }),
    JQuery: (version) => ({
      name: `widget-up-input-jquery${getMajorVersion(version)}`,
      version: inputNpmManager.getInputByName(
        `widget-up-input-jquery${getMajorVersion(version)}`
      ).packageJson.version,
      scriptSrc: () => `/libs/input.jquery${getMajorVersion(version)}.js`,
      depends: [],
    }),
  };

  return stacks.map((stack) => {
    const mapper = techStackMap[stack.name];
    if (!mapper) {
      throw new Error(`Unsupported tech stack: ${stack.name}`);
    }
    return mapper(stack.version.exact);
  });
}
