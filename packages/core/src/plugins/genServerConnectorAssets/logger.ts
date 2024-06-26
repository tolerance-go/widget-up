import { IdentifierManager } from "@/src/managers/identifierManager";
import { plgLogger } from "../_utils/logger";

const identifierManager = IdentifierManager.getInstance();

export const logger = plgLogger.extendNamespace(
  identifierManager.genServerConnectorAssetsPlgName
);
