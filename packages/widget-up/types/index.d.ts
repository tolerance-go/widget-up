export type { DemoMenuItem } from "widget-up-utils";

/**
 * # 是什么
 *
 * - Demo 入口配置
 *
 * # 解决什么需求
 *
 * - 根据它生成 runtimeRollup 的插件数组，动态构建 demo 组件
 */
export type DemoInput = {
  name: string;
  path: string;
};
