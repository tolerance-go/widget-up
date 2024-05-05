// demo 文件的元数据类型，用 json 文件存储
export type DemoFileConfig = {
  name?: string;
  globals: {
    component: string;
    register: string;
  };
};

export interface DemoMenuMeta {
  name: string;
  children?: DemoMenuMeta[];
  globals?: {
    component: string;
    register: string;
  };
  path: string;
  type: "directory" | "file";
}
