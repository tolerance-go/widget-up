import { VersionData } from "../../types/version";

export interface TagEvents {
  loaded: { id: string };
  execute: { id: string };
  executed: { id: string };
  allScriptsExecuted: {};
}

export interface HTMLDependencyDetail {
  // 精确 version
  version: VersionData;
  subDependencies: Record<string, HTMLDependencyDetail>;
  isGlobal: boolean;
  name: string;
}

export type HTMLDependencyListItem = {
  version: VersionData;
  name: string;
  data?: Record<string, any>;
};

export interface HTMLDependencyListDiff {
  insert: HTMLDependencyListInsertionDetail[]; // 插入的标签及其位置
  remove: HTMLDependencyListItem[]; // 需要删除的标签
  update: HTMLDependencyListItem[]; // 需要更新的标签（如果有）
  move: HTMLDependencyListInsertionDetail[]; // 需要更新的标签（如果有）
}

export interface HTMLDependencyListInsertionDetail {
  dep: HTMLDependencyListItem;
  prevDep: HTMLDependencyListItem | null; // 插入在哪个标签之后，null 表示添加到开头
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

// 定义一个类型来表示依赖树的节点
export interface HTMLDependency {
  name: string;
  version: string;
  scriptSrc?: (dep: HTMLDependencyListItem) => string;
  linkHref?: (dep: HTMLDependencyListItem) => string;
  depends?: HTMLDependency[];
}

/**
 * DependencyTreeNode 的变体，
 * scriptSrc 和 linkHref 类型是字符串
 */
export type HTMLDependencyJSON = Omit<
  HTMLDependency,
  "scriptSrc" | "linkHref" | "depends"
> & {
  scriptSrc: string;
  linkHref: string;
  depends?: HTMLDependencyJSON[];
};
