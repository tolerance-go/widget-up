import axios from "axios";
import semver from "semver";

/**
 * 获取符合语义化版本号要求的最新包版本
 * @param packageName 包名，如 'react'
 * @param semverRange 语义化版本范围，如 '^16.13' 或 '~16.13'
 * @returns 返回最新版本的 unpkg URL
 */
export async function getLatestPackageVersion(
  packageName: string,
  semverRange: string
): Promise<string> {
  try {
    // 获取包的所有版本信息
    const response = await axios.get(
      `https://registry.npmjs.org/${packageName}`
    );
    const versions = response.data.versions;
    const latestVersion = getLatestVersionFromSemverRange(
      versions,
      semverRange
    );

    if (!latestVersion) {
      throw new Error("No matching version found");
    }

    return latestVersion;
  } catch (error) {
    console.error("Failed to fetch package version:", error);
    throw error;
  }
}

/**
 * 从所有版本中选取符合语义化版本范围的最新版本
 * @param versions 包的所有版本对象
 * @param semverRange 语义化版本范围
 * @returns 符合范围的最新版本号
 */
function getLatestVersionFromSemverRange(
  versions: any,
  semverRange: string
): string | undefined {
  const validVersions = Object.keys(versions)
    .filter((version) => semver.satisfies(version, semverRange))
    .sort(semver.rcompare); // 使用 semver 的比较函数进行排序，获取最新版本

  return validVersions[0]; // 返回最新版本
}
