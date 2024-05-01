export interface DependencyTagDiff {
  insert: InsertionDetail[]; // 插入的标签及其位置
  remove: DependencyTag[]; // 需要删除的标签
  update: DependencyTag[]; // 需要更新的标签（如果有）
}

export interface InsertionDetail {
  tag: DependencyTag;
  prevSrc: string | null; // 插入在哪个标签之前，null 表示添加到末尾
}

export interface DependencyTag {
  type: "script" | "link"; // 标识标签类型
  src: string; // script 的 src 或 link 的 href
  attributes: {
    // 其他需要管理的属性
    [key: string]: string;
  };
}

export interface RuntimeDependencyTag extends DependencyTag {
  type: "script" | "link"; // 标识标签类型
  src: string; // script 的 src 或 link 的 href
  attributes: {
    // 其他需要管理的属性
    [key: string]: string;
  };
  loaded?: boolean;
  executed?: boolean;
}
