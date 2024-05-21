import path from "path";
import { normalizePath, semverToIdentifier } from "widget-up-utils";
import { fileURLToPath } from "url";
import { dirname } from "path";

interface PathManagerOptions {
  cwdPath: string;
  modulePath: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class PathManager {
  private static instance: PathManager;

  public static getInstance(): PathManager {
    if (!PathManager.instance) {
      const modulePath = path.join(__dirname, "..");
      const cwdPath = process.cwd();

      PathManager.instance = new PathManager({
        cwdPath,
        modulePath,
      });
    }
    return PathManager.instance;
  }

  public cwdPath: string;
  public modulePath: string;

  constructor(options: PathManagerOptions) {
    this.cwdPath = options.cwdPath;
    this.modulePath = options.modulePath;
  }
}
