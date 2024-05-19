import { normalizePath } from "@/src/utils/normalizePath";
import { DemoData, DemoFileConfig } from "@/types";
import realFs from "fs";
import realPath from "path";
import { normalizeDemoFileConfig } from "./normalizeDemoFileConfig";
import path from "path";
import { PathManager } from "../pathManager";
import { DirectoryStructure } from "widget-up-utils";

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

export const convertDirectoryToDemo = (
  directory: DirectoryStructure[],
  pathManager: PathManager,
  fs = realFs,
  path = realPath
): DemoData[] => {
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
        const menuItem: DemoData = {
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

      const menuItem: DemoData = {
        config: normalizeDemoFileConfig(config, item, pathManager),
        children: convertDirectoryToDemo(
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
    .filter(Boolean) as DemoData[];
};
