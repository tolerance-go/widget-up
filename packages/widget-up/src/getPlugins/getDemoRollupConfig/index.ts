/**
 * # 是什么
 *
 * - 获取 demo 的 rollup 配置
 * - ts 编写
 * - 运行时调用 rollup 构建 demo 里面的入口文件
 *
 * # 解决什么需求
 *
 * - 开发的时候，把 demo 里面的文件作为入口，构建到 dist/demos 里面
 *
 * # 怎么用
 *
 * ```ts
 * import { getDemoRollupConfig } from "widget-up";
 *
 * const demoRollupConfig = await getDemoRollupConfig({
 * ...
 * });
 */

import nodeResolve from "@rollup/plugin-node-resolve";
import { options } from "less";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import { DemoMenuItem } from "widget-up-utils";

export function getDemoRollupConfig({
  demoMenus,
}: {
  demoMenus: DemoMenuItem[];
}) {
  return [];
}
