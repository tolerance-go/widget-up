import { EventBus } from "@/src/EventBus";
import { DependencyListDiff, DependencyListItem, ScriptTag } from "../../../../types/HTMLDependencyManager";
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
    debug = false
  }: {
    eventBus?: EventBus<TagEvents>;
    document: Document;
    container?: HTMLElement;
    srcBuilder?: (dep: DependencyListItem) => string;
    debug?: boolean
  }) {
    if (!container) {
      container = document.createElement("div");
      container.setAttribute("id", ScriptTagManagerContainerId);
      document.body.appendChild(container);
    }

    super({ document, container });
    this.eventBus = eventBus || new EventBus<TagEvents>(debug);
    this.eventBus.on("executed", (payload) => this.onTagExecuted(payload.id));

    // 设置事件监听，准备处理标签加载完成的事件
    this.eventBus.on("loaded", (payload) => {
      this.onTagLoaded(payload.id);
    });

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

  // 标签加载完成处理
  public onTagLoaded(src: string) {
    const tag = this.tags.find((t) => t.src === src);
    if (tag) {
      tag.loaded = true; // 标记为加载完成
      this.checkExecute();
    }
  }

  // 标签执行完成处理
  public onTagExecuted(id: string) {
    const tag = this.tags.find((t) => t.src === id);
    if (tag) {
      tag.executed = true; // 标记为执行完成
      this.checkExecute();
    }
  }

  // 检查并执行标签
  public checkExecute() {
    let allPreviousLoadedAndExecuted = true;
    for (const tag of this.tags) {
      if (tag.loaded && !tag.executed && allPreviousLoadedAndExecuted) {
        this.eventBus.emit("execute", { id: tag.src });
        break;
      }
      allPreviousLoadedAndExecuted = !!tag.loaded && !!tag.executed;
    }
  }
}
