import { FileLogger } from "@/src/loggers/FileLogger";
import path from "path";

export const logger = new FileLogger(
  path.join(
    process.cwd(),
    ".logs/serveLivereload",
    new Date().toISOString().substring(0, 10)
  )
);
