import { DemoFileData, DemoFileConfig } from "@/types";
import realFs from "fs";
import { default as path, default as realPath } from "path";
import { DirectoryStructure } from "widget-up-utils";
import { PathManager } from "../pathManager";
import { normalizeDemoFileConfig } from "./normalizeDemoFileConfig";

const getDemoConfig = (item: DirectoryStructure, fs = realFs) => {
  const parsed = path.parse(item.path);

  const jsonFile = path.join(parsed.dir, `${parsed.name}.config.json`);

  const config = fs.existsSync(jsonFile)
    ? (JSON.parse(
        fs.readFileSync(jsonFile, {
          encoding: "utf-8",
        })
      ) as DemoFileConfig)
    : {};

  return config;
};

export const convertDirectoryToDemoData = (
  directory: DirectoryStructure[],
  pathManager: PathManager,
  fs = realFs,
  path = realPath
): DemoFileData[] => {
  return directory
    .map((item) => {
      // 如果是文件，直接读取文件同级的文件的 json 版本获取 meta 数据，如果不存在就报错
      if (item.type === "file") {
        const parsed = path.parse(item.path);

        if (parsed.ext === ".json") {
          return;
        }

        const config = getDemoConfig(item, fs);

        // Create the basic menu item from the directory item
        const menuItem: DemoFileData = {
          config: normalizeDemoFileConfig(config, item, pathManager),
          path: item.path,
          type: item.type,
        };
        return menuItem;
      }

      /**
       * 如果是文件夹，读取同级别下的 config.json 文件
       * - group
       *  - demo.ts
       *  - demo.config.json
       * - group.config.json
       */
      const config = getDemoConfig(item, fs);

      const menuItem: DemoFileData = {
        config: normalizeDemoFileConfig(config, item, pathManager),
        children: convertDirectoryToDemoData(
          item.children ?? [],
          pathManager,
          fs,
          path
        ),
        path: item.path,
        type: item.type,
      };

      return menuItem;
    })
    .filter(Boolean) as DemoFileData[];
};
