/**
 * 是什么
 *
 * - 递归遍历目录结构，将目录结构转换为 demo 元数据
 */
import { DemoFileConfig, DemoData } from "@/types/demoFileMeta";
import fs from "fs";
import path from "path";
import { DirectoryStructure } from "../parseDirectoryStructure";

export function convertDirectoryToDemo(
  directory: DirectoryStructure[]
): DemoData[] {
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

        // Create the basic menu item from the directory item
        const menuItem: DemoData = {
          config,
          path: item.path,
          type: item.type,
        };
        return menuItem;
      }

      const menuItem: DemoData = {
        children: convertDirectoryToDemo(item.children ?? []),
        path: item.path,
        type: item.type,
      };
      return menuItem;
    })
    .filter(Boolean) as DemoData[];
}