export interface DependencyDetail {
  versionRange: string;
  // 精确 version
  version: string;
  subDependencies: Record<string, DependencyDetail>;
  isGlobal: boolean;
  name: string;
}

export type DependencyListItem = {
  version: string;
  name: string;
  data?: Record<string, any>;
};

export interface DependencyListDiff {
  insert: DependencyListInsertionDetail[]; // 插入的标签及其位置
  remove: DependencyListItem[]; // 需要删除的标签
  update: DependencyListItem[]; // 需要更新的标签（如果有）
  move: DependencyListInsertionDetail[]; // 需要更新的标签（如果有）
}

export interface DependencyListInsertionDetail {
  dep: DependencyListItem;
  prevDep: DependencyListItem | null; // 插入在哪个标签之后，null 表示添加到开头
}

export interface DependencyTag {
  type: "script" | "link"; // 标识标签类型
  src: string; // script 的 src 或 link 的 href
  attributes: {
    // 其他需要管理的属性
    [key: string]: string;
  };
}

export interface LinkTag extends DependencyTag {
  type: "link"; // 标识标签类型
}

export interface ScriptTag extends DependencyTag {
  type: "script"; // 标识标签类型
  loaded?: boolean;
  executed?: boolean;
}

export interface TagListInsertionDetail {
  dep: DependencyTag;
  prevDep: DependencyTag | null; // 插入在哪个标签之后，null 表示添加到开头
}

export interface ScriptTagListInsertionDetail {
  tag: ScriptTag;
  prevTag: ScriptTag | null; // 插入在哪个标签之后，null 表示添加到开头
}

export interface ScriptTagDiff {
  insert: ScriptTagListInsertionDetail[]; // 插入的标签及其位置
  remove: ScriptTag[]; // 需要删除的标签
  update: ScriptTag[]; // 需要更新的标签（如果有）
  move: ScriptTagListInsertionDetail[]; // 需要更新的标签（如果有）
}
