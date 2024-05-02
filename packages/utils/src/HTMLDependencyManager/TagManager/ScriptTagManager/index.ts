import { EventBus } from "@/src/EventBus";
import { DependencyListDiff, DependencyListItem, ScriptTag } from "../../types";
import { TagManagerBase } from "../TagManagerBase";

export interface TagEvents {
  loaded: { id: string };
  execute: { id: string };
  executed: { id: string };
}

export const ScriptTagManagerContainerId = "script-tag-manager-container";

export class ScriptTagManager extends TagManagerBase<ScriptTag> {
  private eventBus: EventBus<TagEvents>;
  private srcBuilder: (dep: DependencyListItem) => string; // 新增参数用于自定义构造 src

  constructor({
    eventBus,
    document,
    container,
    srcBuilder,
  }: {
    eventBus?: EventBus<TagEvents>;
    document: Document;
    container?: HTMLElement;
    srcBuilder?: (dep: DependencyListItem) => string;
  }) {
    if (!container) {
      container = document.createElement("div");
      container.setAttribute("id", ScriptTagManagerContainerId);
      document.body.appendChild(container);
    }

    super({ document, container });
    this.eventBus = eventBus || new EventBus<TagEvents>();
    this.eventBus.on("executed", (payload) => this.onTagExecuted(payload.id));
    this.srcBuilder = srcBuilder || ((dep) => `${dep.name}@${dep.version}.js`);
  }

  createSelectorForTag(tag: ScriptTag): string {
    // 使用 src 属性作为选择器
    return `script[src="${tag.src}"]`;
  }

  protected dependencyListItemToTagItem(item: DependencyListItem): ScriptTag {
    return {
      type: "script",
      src: this.srcBuilder(item),
      attributes: {
        async: "true",
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
}
