import { InputNpmManager } from "@/src/managers/getInputNpmManager";
import { DependencyTreeNodeJson, TechStack, TechType } from "@/types";
import { getInputNpmName } from "../getInputNpmName";
import { getMajorVersion } from "widget-up-utils";
import { PathManager } from "@/src/managers/PathManager";

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
      scriptSrc: `(dep) => \`${
        PathManager.getInstance().serverConnectorsUrl
      }/widget-up-input-react${getMajorVersion(
        stack.version.exact
      )}_\${WidgetUpRuntime.utils.semverToIdentifier(dep.version.exact)}.js\``,
      linkHref: `() => ''`,
      depends: [],
    }),
    Vue: (version) => ({
      name: inputNpmName,
      version: inputNpmManager.getInputByName(inputNpmName).packageJson.version,
      scriptSrc: `(dep) => \`${
        PathManager.getInstance().serverConnectorsUrl
      }/widget-up-input-vue${getMajorVersion(
        stack.version.exact
      )}_\${WidgetUpRuntime.utils.semverToIdentifier(dep.version.exact)}.js\``,
      linkHref: `() => ''`,
      depends: [],
    }),
    JQuery: (version) => ({
      name: inputNpmName,
      version: inputNpmManager.getInputByName(inputNpmName).packageJson.version,
      scriptSrc: `(dep) => \`${
        PathManager.getInstance().serverConnectorsUrl
      }/widget-up-input-jquery${getMajorVersion(
        stack.version.exact
      )}_\${WidgetUpRuntime.utils.semverToIdentifier(dep.version.exact)}.js\``,
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
