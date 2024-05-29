/**
 * 是什么
 *
 * - 用户在编写组件的 demo 的时候，可以通过配置文件，来配置 demo 的一些信息
 */
export type DemoFileConfig = {
  // demo 的菜单名称
  menuTitle?: string;
};

export type DemoFileNormalizedConfig = Required<DemoFileConfig>;

/**
 * 是什么
 *
 * - 用户 demos 文件夹下的目录结构所对应的结构元数据
 */
export interface DemoFileData {
  path: string;
  type: "directory" | "file";
  config: DemoFileNormalizedConfig;
  children?: DemoFileData[];
}
