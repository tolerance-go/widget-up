import {
  DependencyListDiff,
  DependencyListInsertionDetail,
  DependencyListItem,
  DependencyTag,
  TagDiff,
} from "../types";

export abstract class TagManagerBase<TTag extends DependencyTag> {
  protected tags: TTag[] = [];
  protected document?: Document;

  constructor({ document }: { document?: Document }) {
    this.document = document;
  }

  abstract applyDependencyDiffs(diffs: DependencyListDiff): void;

  abstract createSelectorForTag(tag: TTag): string;

  protected abstract dependencyListItemToTagItem(
    item: DependencyListItem
  ): TTag;

  protected getTags(): TTag[] {
    return this.tags;
  }

  protected updateTags(diffs: TagDiff<TTag>) {
    diffs.insert.forEach((insertDetail) => {
      this.insertTag(insertDetail.tag, insertDetail.prevTag);
    });

    this.moveTags(diffs);
    diffs.remove.forEach((tag) => this.removeTag(tag.src));
    diffs.update.forEach((tag) => this.updateTag(tag));
  }

  protected convertDependencyListDiffToTagDiff(
    diff: DependencyListDiff
  ): TagDiff<TTag> {
    const dependencyListInsertionDetailToTag = (
      detail: DependencyListInsertionDetail
    ) => {
      return {
        tag: this.dependencyListItemToTagItem(detail.dep),
        prevTag: detail.prevDep
          ? this.dependencyListItemToTagItem(detail.prevDep)
          : null,
      };
    };

    return {
      insert: diff.insert.map(dependencyListInsertionDetailToTag),
      remove: diff.remove.map(this.dependencyListItemToTagItem),
      update: diff.update.map(this.dependencyListItemToTagItem),
      move: diff.move.map(dependencyListInsertionDetailToTag),
    };
  }

  protected moveTags(diffs: TagDiff<TTag>) {
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
      if (moveDetail.prevTag === null) {
        // 如果 prevSrc 为 null，插入到数组的第一个位置
        this.tags.unshift(movingTag);
      } else {
        // 找到 prevSrc 对应的标签的索引，然后在其后面插入新标签
        const beforeIndex = this.tags.findIndex(
          (t) => t.src === moveDetail.prevTag!.src
        );
        if (beforeIndex >= 0) {
          this.tags.splice(beforeIndex + 1, 0, movingTag);
        } else {
          // 如果找不到 prevSrc 指定的标签，可以选择抛出错误或者默认行为（如插入到末尾）
          // 这里选择抛出错误
          throw new Error(
            `prevSrc tag "${moveDetail.prevTag.src}" not found in the tags list.`
          );
        }
      }
    });
  }

  // 插入标签
  protected insertTag(tag: TTag, prevTag: TTag | null) {
    if (prevTag === null) {
      // 如果 beforeSrc 为 null，插入到数组的第一个位置
      this.tags.unshift({ ...tag, loaded: false, executed: false });
    } else {
      // 找到 beforeSrc 对应的标签的索引，然后在其后面插入新标签
      const beforeIndex = this.tags.findIndex((t) => t.src === prevTag.src);
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
          `beforeSrc tag "${prevTag.src}" not found in the tags list.`
        );
      }
    }
  }

  // 移除标签
  protected removeTag(src: string) {
    this.tags = this.tags.filter((tag) => tag.src !== src);
  }

  // 更新标签
  protected updateTag(tag: TTag) {
    const index = this.tags.findIndex((t) => t.src === tag.src);
    if (index !== -1) {
      this.tags[index] = {
        ...tag,
      };
    }
  }

  protected updateHtml(diff: TagDiff<TTag>) {
    if (!this.document) return;

    const head = this.document.head;

    // 处理插入的标签
    diff.insert.forEach((detail) => {
      const element = this.createElementFromTag(detail.tag, this.document!);
      this.insertElementInHead(element, detail.prevTag, head);
    });

    // 处理移动的标签
    diff.move.forEach((moveDetail) => {
      const selector = this.createSelectorForTag(moveDetail.tag);
      const element = head.querySelector(selector);
      if (element) {
        this.insertElementInHead(
          element,
          moveDetail.prevTag,
          head
        );
      }
    });

    // 处理移除的标签
    diff.remove.forEach((tag) => {
      const selector = this.createSelectorForTag(tag);
      const elements = head.querySelectorAll(selector);
      elements.forEach((el) => el.parentNode?.removeChild(el));
    });

    // 处理更新的标签
    diff.update.forEach((tag) => {
      const selector = this.createSelectorForTag(tag);
      const elements = head.querySelectorAll(selector);
      elements.forEach((el) => {
        Object.keys(tag.attributes).forEach((attr) => {
          el.setAttribute(attr, tag.attributes[attr]);
        });
      });
    });
  }

  // 辅助方法：在头部中正确地插入元素
  protected insertElementInHead(
    element: Element,
    prevTag: TTag | null,
    container: HTMLElement
  ) {
    let referenceElement: Element | null = null;

    // 找到参考元素
    if (prevTag) {
      // 需要根据 element 的类型决定是使用 src 还是 href 作为属性选择器
      const selector = this.createSelectorForTag(prevTag)
      referenceElement = container.querySelector(selector);
    }

    if (referenceElement) {
      // 在 referenceElement 的后面插入元素
      const nextSibling = referenceElement.nextSibling;
      container.insertBefore(element, nextSibling); // 如果 nextSibling 为 null，自动插入到列表末尾
    } else {
      // 如果没有找到 prevSrc 对应的元素或 prevSrc 为 null，插入到头部的第一个位置
      const firstChild = container.firstChild;
      if (prevTag === null || !firstChild) {
        container.insertBefore(element, firstChild);
      } else {
        // 如果未找到参考元素且 prevSrc 不是 null，则插入到末尾
        container.appendChild(element);
      }
    }
  }

  // 辅助方法：从 DependencyTag 创建 DOM 元素
  protected createElementFromTag(
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
