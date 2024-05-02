import { EventBus } from "@/src/EventBus";
import {
  LinkTag,
  DependencyListItem,
  DependencyListDiff,
  DependencyListInsertionDetail,
  LinkTagInsertionDetail,
  LinkTagDiff,
  DependencyTag,
} from "../../types";

export class LinkTagManager {
  private tags: LinkTag[] = [];
  private document?: Document;
  private hrefBuilder: (dep: DependencyListItem) => string; // 新增参数用于自定义构造 href

  constructor({
    document,
    hrefBuilder,
  }: {
    document?: Document;
    hrefBuilder?: (dep: DependencyListItem) => string;
  }) {
    this.document = document;
    this.hrefBuilder =
      hrefBuilder ||
      ((dep) => `https://cdn.example.com/${dep.name}@${dep.version}.css`);
  }

  getTags() {
    return this.tags;
  }

  applyDependencyDiffs(diffs: DependencyListDiff) {
    const tagDiffs = this.dependencyListDiffToTagDiff(diffs);

    this.updateTags(tagDiffs);

    this.syncHtml(tagDiffs);
  }

  private dependencyListItemToTagItem(item: DependencyListItem): LinkTag {
    return {
      type: "link",
      src: this.hrefBuilder(item),
      attributes: {
        "data-managed": "true",
        rel: "stylesheet",
      },
    };
  }

  private dependencyListInsertionDetailToLink(
    detail: DependencyListInsertionDetail
  ): LinkTagInsertionDetail {
    return {
      tag: this.dependencyListItemToTagItem(detail.dep),
      prevTag: detail.prevDep
        ? this.dependencyListItemToTagItem(detail.prevDep)
        : null,
    };
  }

  private dependencyListDiffToTagDiff(diff: DependencyListDiff): LinkTagDiff {
    return {
      insert: diff.insert.map(this.dependencyListInsertionDetailToLink),
      move: diff.move.map(this.dependencyListInsertionDetailToLink),
      remove: diff.remove.map(this.dependencyListItemToTagItem),
      update: diff.update.map(this.dependencyListItemToTagItem),
    };
  }

  private updateTags(diffs: LinkTagDiff) {
    diffs.insert.forEach((insertDetail) => {
      this.insertTag(insertDetail.tag, insertDetail.prevTag?.src ?? null);
    });

    this.moveTags(diffs);
    diffs.remove.forEach((tag) => this.removeTag(tag.src));
    diffs.update.forEach((tag) => this.updateTag(tag));
  }

  private moveTags(diffs: LinkTagDiff) {
    diffs.move.forEach((moveDetail) => {
      const currentIndex = this.tags.findIndex(
        (t) => t.src === moveDetail.tag.src
      );
      if (currentIndex === -1) {
        throw new Error(`Tag "${moveDetail.tag.src}" not found.`);
      }
      const [movingTag] = this.tags.splice(currentIndex, 1);
      const beforeIndex = this.tags.findIndex(
        (t) => t.src === moveDetail.prevTag?.src
      );
      if (beforeIndex >= 0) {
        this.tags.splice(beforeIndex + 1, 0, movingTag);
      } else {
        throw new Error(
          `prevSrc tag "${moveDetail.prevTag!.src}" not found in the tags list.`
        );
      }
    });
  }

  // 插入标签
  private insertTag(tag: LinkTag, prevSrc: string | null) {
    if (prevSrc === null) {
      // 如果 beforeSrc 为 null，插入到数组的第一个位置
      this.tags.unshift({ ...tag });
    } else {
      // 找到 beforeSrc 对应的标签的索引，然后在其后面插入新标签
      const beforeIndex = this.tags.findIndex((t) => t.src === prevSrc);
      if (beforeIndex >= 0) {
        this.tags.splice(beforeIndex + 1, 0, {
          ...tag,
        });
      } else {
        // 如果找不到 beforeSrc 指定的标签，可以选择抛出错误或者默认行为（如插入到末尾）
        // 这里选择抛出错误
        throw new Error(
          `beforeSrc tag "${prevSrc}" not found in the tags list.`
        );
      }
    }
  }

  // 移除标签
  private removeTag(src: string) {
    this.tags = this.tags.filter((tag) => tag.src !== src);
  }

  // 更新标签
  private updateTag(tag: LinkTag) {
    const index = this.tags.findIndex((t) => t.src === tag.src);
    if (index !== -1) {
      this.tags[index] = {
        ...tag,
      };
    }
  }

  public syncHtml(diff: LinkTagDiff) {
    if (!this.document) return;

    const head = this.document.head;
    diff.insert.forEach((detail) => {
      const element = this.createElementFromTag(detail.tag, this.document!);
      this.insertElementInHead(element, detail.prevTag?.src ?? null, head);
    });

    diff.move.forEach((moveDetail) => {
      const selector = `[href="${moveDetail.tag.src}"]`;
      const element = head.querySelector(selector);
      if (element) {
        this.insertElementInHead(
          element,
          moveDetail.prevTag?.src ?? null,
          head
        );
      }
    });

    diff.remove.forEach((tag) => {
      const selector = `[href="${tag.src}"]`;
      const elements = head.querySelectorAll(selector);
      elements.forEach((el) => el.parentNode?.removeChild(el));
    });

    diff.update.forEach((tag) => {
      const selector = `[href="${tag.src}"]`;
      const elements = head.querySelectorAll(selector);
      elements.forEach((el) => {
        Object.keys(tag.attributes).forEach((attr) => {
          el.setAttribute(attr, tag.attributes[attr]);
        });
      });
    });
  }

  private createElementFromTag(
    tag: DependencyTag,
    document: Document
  ): HTMLElement {
    const element = document.createElement(tag.type);
    if (tag.type === "link") {
      const linkEl = element as HTMLLinkElement;
      linkEl.href = tag.src;
      linkEl.rel = "stylesheet";
    }

    Object.keys(tag.attributes).forEach((attr) => {
      element.setAttribute(attr, tag.attributes[attr]);
    });

    element.setAttribute("data-managed", "true");
    return element;
  }

  private insertElementInHead(
    element: Element,
    prevSrc: string | null,
    head: HTMLHeadElement
  ) {
    let referenceElement = null;
    if (prevSrc) {
      referenceElement = head.querySelector(`[href="${prevSrc}"]`);
    }

    if (referenceElement) {
      const nextSibling = referenceElement.nextSibling;
      head.insertBefore(element, nextSibling);
    } else {
      head.insertBefore(element, head.firstChild);
    }
  }
}
