import { EventBus } from "@/src/EventBus";
import {
  RuntimeDependencyTag,
  DependencyTagDiff,
  DependencyTag,
} from "../types";

export interface TagEvents {
  loaded: { id: string };
  execute: { id: string };
  executed: { id: string };
}

export class TagManager {
  private tags: RuntimeDependencyTag[] = [];
  private eventBus: EventBus<TagEvents>;
  private document?: Document;

  constructor({
    eventBus,
    document,
  }: {
    eventBus?: EventBus<TagEvents>;
    document?: Document;
  }) {
    this.eventBus = eventBus || new EventBus<TagEvents>();
    this.eventBus.on("executed", (payload) => this.onTagExecuted(payload.id));
    this.document = document;
  }

  getTags() {
    return this.tags;
  }

  // 处理传入的标签差异
  applyDependencyDiffs(diffs: DependencyTagDiff) {
    this.updateTags(diffs);

    if (this.document) {
      this.syncHtml(diffs, this.document);
    }

    // 检查是否有标签需要执行
    this.checkExecute();
  }

  private updateTags(diffs: DependencyTagDiff) {
    // 处理插入
    diffs.insert.forEach((insertDetail) => {
      this.insertTag(insertDetail.tag, insertDetail.prevSrc);
    });

    // 处理移动
    this.moveTags(diffs);

    // 处理移除
    diffs.remove.forEach((tag) => this.removeTag(tag.src));

    // 处理更新
    diffs.update.forEach((tag) => this.updateTag(tag));
  }

  private moveTags(diffs: DependencyTagDiff) {
    // 遍历 move 数组，对每个需要移动的标签进行处理
    diffs.move.forEach((moveDetail) => {
      // 首先找到需要移动的标签的当前位置
      const currentIndex = this.tags.findIndex(
        (t) => t.src === moveDetail.tag.src
      );
      if (currentIndex === -1) {
        throw new Error(`Tag "${moveDetail.tag.src}" not found.`);
      }
      // 移除当前位置的标签
      const [movingTag] = this.tags.splice(currentIndex, 1);

      // 确定新的插入位置
      if (moveDetail.prevSrc === null) {
        // 如果 prevSrc 为 null，插入到数组的第一个位置
        this.tags.unshift(movingTag);
      } else {
        // 找到 prevSrc 对应的标签的索引，然后在其后面插入新标签
        const beforeIndex = this.tags.findIndex(
          (t) => t.src === moveDetail.prevSrc
        );
        if (beforeIndex >= 0) {
          this.tags.splice(beforeIndex + 1, 0, movingTag);
        } else {
          // 如果找不到 prevSrc 指定的标签，可以选择抛出错误或者默认行为（如插入到末尾）
          // 这里选择抛出错误
          throw new Error(
            `prevSrc tag "${moveDetail.prevSrc}" not found in the tags list.`
          );
        }
      }
    });
  }

  // 插入标签
  private insertTag(tag: RuntimeDependencyTag, beforeSrc: string | null) {
    if (beforeSrc === null) {
      // 如果 beforeSrc 为 null，插入到数组的第一个位置
      this.tags.unshift({ ...tag, loaded: false, executed: false });
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

  private syncHtml(diff: DependencyTagDiff, document: Document) {
    const head = document.head;

    // 处理插入的标签
    diff.insert.forEach((detail) => {
      const element = this.createElementFromTag(detail.tag, document);
      if (detail.prevSrc) {
        // 寻找指定的前一个元素
        const referenceElement = head.querySelector(
          `[src="${detail.prevSrc}"]`
        );
        const beforeElement = referenceElement
          ? referenceElement.nextSibling
          : null;
        // 如果找到位置，则插入到该位置
        if (beforeElement) {
          head.insertBefore(element, beforeElement);
        } else {
          // 如果没有找到前一个元素，插入到最后
          head.appendChild(element);
        }
      } else {
        // 如果没有指定 beforeSrc，即插入位置为第一个
        const firstChild = head.firstChild;
        if (firstChild) {
          head.insertBefore(element, firstChild);
        } else {
          // 如果头部容器为空，直接添加
          head.appendChild(element);
        }
      }
    });

    // Handling the removal of tags
    diff.remove.forEach((tag) => {
      const elements = head.querySelectorAll(`${tag.type}[src="${tag.src}"]`);
      elements.forEach((el) => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    });

    // Handle tag updates
    diff.update.forEach((tag) => {
      const elements = head.querySelectorAll(`${tag.type}[src="${tag.src}"]`);
      elements.forEach((el) => {
        Object.keys(tag.attributes).forEach((attr) => {
          el.setAttribute(attr, tag.attributes[attr]);
        });
      });
    });
  }

  // 辅助方法：从 DependencyTag 创建 DOM 元素
  private createElementFromTag(
    tag: DependencyTag,
    document: Document
  ): HTMLElement {
    const element = document.createElement(tag.type) as
      | HTMLScriptElement
      | HTMLLinkElement;

    // 根据标签类型设置对应的资源属性
    if (tag.type === "script") {
      const scriptEl = element as HTMLScriptElement;
      scriptEl.src = tag.src; // 为script设置src
    } else if (tag.type === "link") {
      const linkEl = element as HTMLLinkElement;
      linkEl.href = tag.src;
    }

    // 添加额外的属性
    Object.keys(tag.attributes).forEach((attr) => {
      element.setAttribute(attr, tag.attributes[attr]);
    });
    element.setAttribute("data-managed", "true"); // 标记管理的元素
    return element;
  }
}
