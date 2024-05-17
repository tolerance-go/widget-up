import { VersionData } from "../../types/version";

export interface TagEvents {
  loaded: { id: string };
  execute: { id: string };
  executed: { id: string };
  allScriptsExecuted: {};
}

export interface DependencyDetail {
  // 精确 version
  version: VersionData;
  subDependencies: Record<string, DependencyDetail>;
  isGlobal: boolean;
  name: string;
}

export type DependencyListItem = {
  version: VersionData;
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
  name: string;
  version: string;
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

export type ScriptTagInsertionDetail = TagListInsertionDetail<ScriptTag>;

export type LinkTagInsertionDetail = TagListInsertionDetail<LinkTag>;

export interface TagListInsertionDetail<T extends DependencyTag> {
  tag: T;
  prevTag: T | null;
}

export interface TagDiff<T extends DependencyTag> {
  insert: TagListInsertionDetail<T>[]; // 插入的标签及其位置
  remove: T[]; // 需要删除的标签
  update: T[]; // 需要更新的标签（如果有）
  move: TagListInsertionDetail<T>[]; // 需要移动的标签（如果有）
}

export type ScriptTagDiff = TagDiff<ScriptTag>;

export type LinkTagDiff = TagDiff<LinkTag>;
