/**
 * 是什么
 * 
 * - 用户在编写组件的 demo 的时候，可以通过配置文件，来配置 demo 的一些信息
 */
export type DemoFileConfig = {
  name?: string;
  globals: {
    component: string;
    register: string;
  };
};

/**
 * 是什么
 * 
 * - 用户 demos 文件夹下的目录结构所对应的结构元数据
 */
export interface DemoMeta {
  path: string;
  type: "directory" | "file";
  config?: DemoFileConfig;
  children?: DemoMeta[];
}
