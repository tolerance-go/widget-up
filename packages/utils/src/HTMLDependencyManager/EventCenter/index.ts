import { EventBus } from "@/src/EventBus";
import { RuntimeDependencyTag, TagDiff } from "../types";

export interface TagEvents {
  loaded: { id: string };
  execute: { id: string };
  executed: { id: string };
}

export class TagManager {
  private tags: RuntimeDependencyTag[] = [];
  private eventBus: EventBus<TagEvents>;

  constructor(eventBus: EventBus<TagEvents>) {
    this.eventBus = eventBus;
    this.eventBus.on("executed", (payload) => this.onTagExecuted(payload.id));
  }

  getTags() {
    return this.tags;
  }

  // 处理传入的标签差异
  applyDiffs(diffs: TagDiff) {
    // 处理插入
    diffs.insert.forEach((insertDetail) => {
      this.insertTag(insertDetail.tag, insertDetail.prevSrc);
    });

    // 处理移除
    diffs.remove.forEach((tag) => this.removeTag(tag.src));

    // 处理更新
    diffs.update.forEach((tag) => this.updateTag(tag));

    // 检查是否有标签需要执行
    this.checkExecute();
  }

  // 插入标签
  private insertTag(tag: RuntimeDependencyTag, beforeSrc: string | null) {
    if (beforeSrc === null) {
      // 如果 beforeSrc 为 null，直接插入到数组末尾
      this.tags.push({ ...tag, loaded: false, executed: false });
    } else {
      // 找到 beforeSrc 对应的标签的索引，然后在其后面插入新标签
      const beforeIndex = this.tags.findIndex((t) => t.src === beforeSrc);
      if (beforeIndex >= 0) {
        this.tags.splice(beforeIndex + 1, 0, {
          ...tag,
          loaded: false,
          executed: false,
        });
      } else {
        // 如果找不到 beforeSrc 指定的标签，可以选择抛出错误或者默认行为（如插入到末尾）
        // 这里选择抛出错误
        throw new Error(
          `beforeSrc tag "${beforeSrc}" not found in the tags list.`
        );
      }
    }

    // 设置事件监听，准备处理标签加载完成的事件
    this.eventBus.on("loaded", (payload) => {
      if (payload.id === tag.src) {
        this.onTagLoaded(tag.src);
      }
    });
  }

  // 移除标签
  private removeTag(src: string) {
    this.tags = this.tags.filter((tag) => tag.src !== src);
    this.eventBus.off("loaded", (payload) => {
      if (payload.id === src) {
        this.onTagLoaded(src);
      }
    });
  }

  // 更新标签
  private updateTag(tag: RuntimeDependencyTag) {
    const index = this.tags.findIndex((t) => t.src === tag.src);
    if (index !== -1) {
      this.tags[index] = {
        ...tag,
        loaded: this.tags[index].loaded,
        executed: this.tags[index].executed,
      };
    }
  }

  // 标签加载完成处理
  private onTagLoaded(src: string) {
    const tag = this.tags.find((t) => t.src === src);
    if (tag) {
      tag.loaded = true; // 标记为加载完成
      this.checkExecute();
    }
  }

  // 标签执行完成处理
  private onTagExecuted(id: string) {
    const tag = this.tags.find((t) => t.src === id);
    if (tag) {
      tag.executed = true; // 标记为执行完成
      this.checkExecute();
    }
  }

  // 检查并执行标签
  private checkExecute() {
    let allPreviousLoadedAndExecuted = true;
    for (const tag of this.tags) {
      if (!tag.loaded || !tag.executed) {
        if (allPreviousLoadedAndExecuted && tag.loaded) {
          this.eventBus.emit("execute", { id: tag.src });
        }
        break;
      }
      allPreviousLoadedAndExecuted = tag.executed;
    }
  }
}
