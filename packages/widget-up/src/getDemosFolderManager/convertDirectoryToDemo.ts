import { DemoData, DemoFileConfig, DemoFileNormalizedConfig } from "@/types";
import { DirectoryStructure } from "../utils/parseDirectoryStructure";
import realFs from "fs";
import realPath from "path";

export const convertDirectoryToDemo = (
  directory: DirectoryStructure[],
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

        const jsonFile = path.join(parsed.dir, `${parsed.name}.config.json`);

        if (!fs.existsSync(jsonFile)) {
          throw new Error(`Meta data not found for file: ${jsonFile}`);
        }

        const config = JSON.parse(
          fs.readFileSync(jsonFile, {
            encoding: "utf-8",
          })
        ) as DemoFileConfig;

        const normalizeDemoFileConfig = (
          config: DemoFileConfig
        ): DemoFileNormalizedConfig => {
          return {
            name: config.name || "Demo",
            globals: {
              component: config.globals?.component || "Component",
              register: config.globals?.register || "register",
            },
          };
        };

        // Create the basic menu item from the directory item
        const menuItem: DemoData = {
          config: normalizeDemoFileConfig(config),
          path: item.path,
          type: item.type,
        };
        return menuItem;
      }

      const menuItem: DemoData = {
        config: {
          name: item.name,
          globals: {
            component: "Component",
            register: "register",
          },
        },
        children: convertDirectoryToDemo(item.children ?? []),
        path: item.path,
        type: item.type,
      };
      return menuItem;
    })
    .filter(Boolean) as DemoData[];
};
