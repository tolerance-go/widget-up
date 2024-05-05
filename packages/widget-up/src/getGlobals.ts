/**
 * 是什么
 * 
 * - 获取 UMD 全局变量配置
 */
import { ParseConfig } from "widget-up-utils";

export function getUMDGlobals(config: ParseConfig) {
  return config.umd?.globals;
}
