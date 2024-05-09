import { InputNpmManager } from "@/src/managers/getInputNpmManager";
import { DependencyTreeNodeJson, TechStack, TechType } from "@/types";
import { getInputNpmName } from "../getInputNpmName";

export function getInputByFrameStack(
  stack: TechStack,
  inputNpmManager: InputNpmManager
): DependencyTreeNodeJson {
  const inputNpmName = getInputNpmName(stack);

  // 这是一个示例映射，用于将技术栈映射到入口文件
  const techStackMap: Record<
    TechType,
    (version: string) => DependencyTreeNodeJson
  > = {
    React: (version) => ({
      name: inputNpmName,
      version: inputNpmManager.getInputByName(inputNpmName).packageJson.version,
      scriptSrc: `() => \`/inputs/widget-up-input-react\${WidgetUpRuntime.utils.getMajorVersion(version)}.js\``,
      linkHref: `() => ''`,
      depends: [],
    }),
    Vue: (version) => ({
      name: inputNpmName,
      version: inputNpmManager.getInputByName(inputNpmName).packageJson.version,
      scriptSrc: `() => \`/inputs/widget-up-input-vue\${WidgetUpRuntime.utils.getMajorVersion(version)}.js\``,
      linkHref: `() => ''`,
      depends: [],
    }),
    JQuery: (version) => ({
      name: inputNpmName,
      version: inputNpmManager.getInputByName(inputNpmName).packageJson.version,
      scriptSrc: `() => \`/inputs/widget-up-input-jquery\${WidgetUpRuntime.utils.getMajorVersion(version)}.js\``,
      linkHref: `() => ''`,
      depends: [],
    }),
  };

  const mapper = techStackMap[stack.name];
  if (!mapper) {
    throw new Error(`Unsupported tech stack: ${stack.name}`);
  }
  return mapper(stack.version.exact);
}
