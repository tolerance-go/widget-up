import { IdentifierManager } from "@/src/managers/identifierManager";
import { coreLogger } from "@/src/utils/logger";

const identifierManager = IdentifierManager.getInstance();

export const plgLogger = coreLogger.extendNamespace(
  identifierManager.serverLibPlgName
);
