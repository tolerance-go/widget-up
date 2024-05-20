import { InputNpmManager } from "@/src/managers/inputNpmManager";
import { DependencyTreeNodeJSON, TechStack, TechType } from "@/types";
import { getInputNpmName } from "../getInputNpmName";
import { getMajorVersion } from "widget-up-utils";
import { PathManager } from "@/src/managers/pathManager";

export function getInputByFrameStack(
  stack: TechStack,
  inputNpmManager: InputNpmManager
): DependencyTreeNodeJSON {
  const inputNpmName = getInputNpmName(stack);

  // 这是一个示例映射，用于将技术栈映射到入口文件
  const techStackMap: Record<
    TechType,
    (version: string) => DependencyTreeNodeJSON
  > = {
    React: (version) => ({
      name: inputNpmName,
      version: inputNpmManager.getInputByName(inputNpmName).packageJson.version,
      scriptSrc: `(dep) => \`${
        PathManager.getInstance().serverConnectorsUrl
      }/widget-up-connector-react${getMajorVersion(
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
      }/widget-up-connector-vue${getMajorVersion(
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
      }/widget-up-connector-jquery${getMajorVersion(
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
