import { MenuItem } from "@/types";
import { DirectoryStructure } from "../parseDirectoryStructure";
import path from "path";
import fs from "fs";
import { DemoFileConfig } from "@/types/demoFileMeta";

export function convertDirectoryToMenu(
  directory: DirectoryStructure[]
): MenuItem[] {
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

        const meta = JSON.parse(
          fs.readFileSync(jsonFile, {
            encoding: "utf-8",
          })
        ) as DemoFileConfig;

        // Create the basic menu item from the directory item
        const menuItem: MenuItem = {
          name: meta.name ?? item.name,
          globals: {
            component: meta.globals.component,
            register: meta.globals.register,
          },
        };
        return menuItem;
      }

      const menuItem: MenuItem = {
        name: item.name,
        children: convertDirectoryToMenu(item.children ?? []),
      };
      return menuItem;
    })
    .filter(Boolean) as MenuItem[];
}
