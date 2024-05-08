import { InputNpmManager } from "@/src/getInputNpmManager";
import { DependencyTreeNodeJson, TechStack, TechType } from "@/types";
import { DependencyTreeNode } from "widget-up-runtime";
import { getMajorVersion } from "widget-up-utils";

export function getInputByFrame(
  stacks: TechStack[],
  inputNpmManager: InputNpmManager
): DependencyTreeNodeJson[] {
  // 这是一个示例映射，用于将技术栈映射到入口文件
  const techStackMap: Record<
    TechType,
    (version: string) => DependencyTreeNodeJson
  > = {
    React: (version) => ({
      name: `widget-up-input-react${getMajorVersion(version)}`,
      version: inputNpmManager.getInputByName(
        `widget-up-input-react${getMajorVersion(version)}`
      ).packageJson.version,
      scriptSrc: `() => \`/libs/input.react\${WidgetUpRuntime.utils.getMajorVersion(version)}.js\``,
      linkHref: `() => ''`,
      depends: [],
    }),
    Vue: (version) => ({
      name: `widget-up-input-vue${getMajorVersion(version)}`,
      version: inputNpmManager.getInputByName(
        `widget-up-input-vue${getMajorVersion(version)}`
      ).packageJson.version,
      scriptSrc: `() => \`/libs/input.vue\${WidgetUpRuntime.utils.getMajorVersion(version)}.js\``,
      linkHref: `() => ''`,
      depends: [],
    }),
    JQuery: (version) => ({
      name: `widget-up-input-jquery${getMajorVersion(version)}`,
      version: inputNpmManager.getInputByName(
        `widget-up-input-jquery${getMajorVersion(version)}`
      ).packageJson.version,
      scriptSrc: `() => \`/libs/input.jquery\${WidgetUpRuntime.utils.getMajorVersion(version)}.js\``,
      linkHref: `() => ''`,
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
