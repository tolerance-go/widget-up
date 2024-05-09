import path from "path";
import { FileLogger } from "widget-up-utils";

export const logger = new FileLogger(
  path.join(process.cwd(), ".logs/widget-up", new Date().toISOString().substring(0, 10)),
);
