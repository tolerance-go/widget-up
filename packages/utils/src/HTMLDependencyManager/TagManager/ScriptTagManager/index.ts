import { EventBus } from "@/src/EventBus";
import {
  DependencyListItem,
  ScriptTag,
} from "../../../../types/HTMLDependencyManager";
import { TagManagerBase } from "../TagManagerBase";
import { scriptManagerLogger } from "./logger";

export interface TagEvents {
  loaded: { id: string };
  execute: { id: string };
  executed: { id: string };
}

export const ScriptTagManagerContainerId = "script-tag-manager-container";

export class ScriptTagManager extends TagManagerBase<ScriptTag> {
  private eventBus: EventBus<TagEvents>;
  private srcBuilder: (dep: DependencyListItem) => string; // 新增参数用于自定义构造 src
  private onAllExecutedCallback?: () => void; // 添加一个可选的回调函数属性

  constructor({
    eventBus,
    document,
    container,
    srcBuilder,
    onAllExecutedCallback, // 新参数
  }: {
    eventBus?: EventBus<TagEvents>;
    document: Document;
    container?: HTMLElement;
    srcBuilder?: (dep: DependencyListItem) => string;
    onAllExecutedCallback?: () => void; // 定义类型
  }) {
    if (!container) {
      container = document.createElement("div");
      container.setAttribute("id", ScriptTagManagerContainerId);
      document.body.appendChild(container);
    }

    super({ document, container });
    this.eventBus = eventBus || new EventBus<TagEvents>();
    this.eventBus.on("executed", (payload) => this.onTagExecuted(payload.id));

    // 设置事件监听，准备处理标签加载完成的事件
    this.eventBus.on("loaded", (payload) => {
      this.onTagLoaded(payload.id);
    });

    this.srcBuilder = srcBuilder || ((dep) => `${dep.name}@${dep.version}.js`);
    this.onAllExecutedCallback = onAllExecutedCallback; // 初始化回调函数
  }

  protected dependencyListItemToTagItem(item: DependencyListItem): ScriptTag {
    scriptManagerLogger.log("dependencyListItemToTagItem", item);

    const src = this.srcBuilder(item);

    scriptManagerLogger.log("dependencyListItemToTagItem src", src);

    return {
      name: item.name,
      version: item.version.exact,
      type: "script",
      src,
      attributes: {
        async: "true",
      },
    };
  }

  // 标签加载完成处理
  public onTagLoaded(id: string) {
    this.debug && console.log(`onTagLoaded id: ${id}`);
    this.debug && console.log(`this.tags: `, this.tags);
    const tag = this.tags.find((t) => t.src === id);
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
    scriptManagerLogger.log("检查执行情况", this.tags);

    let allExecuted = true;
    let firstNotExecuted = null;

    for (const tag of this.tags) {
      if (tag.loaded && !tag.executed) {
        allExecuted = false;
        if (!firstNotExecuted) {
          firstNotExecuted = tag;
          break; // 一旦找到第一个未执行的标签，退出循环
        }
      } else if (!tag.loaded || !tag.executed) {
        allExecuted = false; // 保证即使后续标签都执行了，也正确记录未完全执行的状态
      }
    }

    if (allExecuted && this.onAllExecutedCallback) {
      this.onAllExecutedCallback(); // 如果所有标签都已执行，调用回调
    } else if (firstNotExecuted) {
      this.eventBus.emit("execute", { id: firstNotExecuted.src }); // 触发第一个未执行的标签
    }
  }
}
