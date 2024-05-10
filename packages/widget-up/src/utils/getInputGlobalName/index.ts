import { TechStack } from "@/types";
import { getMajorVersion, TechFrameMapToInputGlobalName } from "widget-up-utils";

export const getInputGlobalName = (frameInfo: TechStack) => {
  const globalName = TechFrameMapToInputGlobalName[frameInfo.name];

  if (!globalName) {
    throw new Error(`未知的框架：${frameInfo.name}`);
  }

  return `${globalName}_${getMajorVersion(frameInfo.version.exact)}`;
};
