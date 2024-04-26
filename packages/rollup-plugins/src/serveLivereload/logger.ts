import path from "path";
import { Logger } from "widget-up-utils";

export const logger = new Logger(
  path.join(
    process.cwd(),
    ".logs/serveLivereload",
    new Date().toISOString().substring(0, 10)
  )
);
