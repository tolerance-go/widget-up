import {
  ParseConfig,
  getLatestPackageVersion,
  semverToIdentifier,
  PackageJson,
} from "widget-up-utils";

export async function generateGlobals(
  config: ParseConfig,
  packageConfig: PackageJson
) {
  const entries = Object.entries(config.umd.global);
  const globals = {};

  for (const [npmName, globalVar] of entries) {
    const version = await getLatestPackageVersion(
      npmName,
      packageConfig.dependencies[npmName]
    );
    globals[npmName] = `${npmName}${semverToIdentifier(version)}`;
  }

  return globals;
}
