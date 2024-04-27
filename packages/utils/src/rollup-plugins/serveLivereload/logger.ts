import path from "path";
import { Logger } from "../_utils";

export const logger = new Logger(
  path.join(
    process.cwd(),
    ".logs/serveLivereload",
    new Date().toISOString().substring(0, 10)
  )
);
