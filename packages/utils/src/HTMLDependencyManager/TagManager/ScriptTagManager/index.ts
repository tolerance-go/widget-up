import { EventBus } from "@/src/EventBus";
import {
  DependencyListDiff,
  DependencyListItem,
  DependencyTag,
  ScriptTag,
  ScriptTagDiff,
} from "../../types";
import { TagManagerBase } from "../TagManagerBase";

export interface TagEvents {
  loaded: { id: string };
  execute: { id: string };
  executed: { id: string };
}

export class ScriptTagManager extends TagManagerBase<ScriptTag> {
  private eventBus: EventBus<TagEvents>;
  private srcBuilder: (dep: DependencyListItem) => string; // 新增参数用于自定义构造 src

  constructor({
    eventBus,
    document,
    srcBuilder,
  }: {
    eventBus?: EventBus<TagEvents>;
    document?: Document;
    srcBuilder?: (dep: DependencyListItem) => string;
  }) {
    super({ document });
    this.eventBus = eventBus || new EventBus<TagEvents>();
    this.eventBus.on("executed", (payload) => this.onTagExecuted(payload.id));
    this.srcBuilder = srcBuilder || ((dep) => `${dep.name}@${dep.version}.js`);
  }

  // 处理传入的标签差异
  applyDependencyDiffs(diffs: DependencyListDiff) {
    const tagDiffs = this.convertDependencyListDiffToTagDiff(diffs);

    this.updateTags(tagDiffs);

    this.updateHtml(tagDiffs);

    // 检查是否有标签需要执行
    this.checkExecute();
  }

  protected dependencyListItemToTagItem(item: DependencyListItem): ScriptTag {
    return {
      type: "script",
      src: this.srcBuilder(item),
      attributes: {
        "data-managed": "true",
      },
    };
  }

  // 插入标签
  protected insertTag(tag: ScriptTag, prevTag: ScriptTag | null) {
    super.insertTag(tag, prevTag);

    // 设置事件监听，准备处理标签加载完成的事件
    this.eventBus.on("loaded", (payload) => {
      if (payload.id === tag.src) {
        this.onTagLoaded(tag.src);
      }
    });
  }

  // 移除标签
  protected removeTag(src: string) {
    super.removeTag(src);
    this.eventBus.off("loaded", (payload) => {
      if (payload.id === src) {
        this.onTagLoaded(src);
      }
    });
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

  public updateHtml(diff: ScriptTagDiff) {
    if (!this.document) return;

    const head = this.document.head;

    // 处理插入的标签
    diff.insert.forEach((detail) => {
      const element = this.createElementFromTag(detail.tag, this.document!);
      this.insertElementInHead(element, detail.prevTag?.src ?? null, head);
    });

    // 处理移动的标签
    diff.move.forEach((moveDetail) => {
      const selector = `[src="${moveDetail.tag.src}"]`;
      const element = head.querySelector(selector);
      if (element) {
        this.insertElementInHead(
          element,
          moveDetail.prevTag?.src ?? null,
          head
        );
      }
    });

    // 处理移除的标签
    diff.remove.forEach((tag) => {
      const selector = `[src="${tag.src}"]`;
      const elements = head.querySelectorAll(selector);
      elements.forEach((el) => el.parentNode?.removeChild(el));
    });

    // 处理更新的标签
    diff.update.forEach((tag) => {
      const selector = `[src="${tag.src}"]`;
      const elements = head.querySelectorAll(selector);
      elements.forEach((el) => {
        Object.keys(tag.attributes).forEach((attr) => {
          el.setAttribute(attr, tag.attributes[attr]);
        });
      });
    });
  }

  // 辅助方法：在头部中正确地插入元素
  private insertElementInHead(
    element: Element,
    prevSrc: string | null,
    head: HTMLHeadElement
  ) {
    let referenceElement: Element | null = null;

    // 找到参考元素
    if (prevSrc) {
      // 需要根据 element 的类型决定是使用 src 还是 href 作为属性选择器
      const attr = element.tagName.toLowerCase() === "link" ? "href" : "src";
      referenceElement = head.querySelector(`[${attr}="${prevSrc}"]`);
    }

    if (referenceElement) {
      // 在 referenceElement 的后面插入元素
      const nextSibling = referenceElement.nextSibling;
      head.insertBefore(element, nextSibling); // 如果 nextSibling 为 null，自动插入到列表末尾
    } else {
      // 如果没有找到 prevSrc 对应的元素或 prevSrc 为 null，插入到头部的第一个位置
      const firstChild = head.firstChild;
      if (prevSrc === null || !firstChild) {
        head.insertBefore(element, firstChild);
      } else {
        // 如果未找到参考元素且 prevSrc 不是 null，则插入到末尾
        head.appendChild(element);
      }
    }
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
