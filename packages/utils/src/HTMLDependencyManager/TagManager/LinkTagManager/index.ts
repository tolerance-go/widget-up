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
import { TagManagerBase } from "../TagManagerBase";

export class LinkTagManager extends TagManagerBase<LinkTag> {
  private hrefBuilder: (dep: DependencyListItem) => string; // 新增参数用于自定义构造 href

  constructor({
    document,
    hrefBuilder,
  }: {
    document?: Document;
    hrefBuilder?: (dep: DependencyListItem) => string;
  }) {
    super({ document }); // 调用基类构造函数
    this.hrefBuilder =
      hrefBuilder ||
      ((dep) => `https://cdn.example.com/${dep.name}@${dep.version}.css`);
  }

  applyDependencyDiffs(diffs: DependencyListDiff) {
    const tagDiffs = this.convertDependencyListDiffToTagDiff(diffs);

    this.updateTags(tagDiffs);

    this.updateHtml(tagDiffs);
  }

  protected dependencyListItemToTagItem(item: DependencyListItem): LinkTag {
    return {
      type: "link",
      src: this.hrefBuilder(item),
      attributes: {
        "data-managed": "true",
        rel: "stylesheet",
      },
    };
  }

  public updateHtml(diff: LinkTagDiff) {
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
