import { Logger } from "@/src/Logger";
import path from "path";

export const logger = new Logger(
  path.join(
    process.cwd(),
    ".logs/htmlRender",
    new Date().toISOString().substring(0, 10)
  )
);
