import { EventBus } from "@/src/eventBus";
import {
  HTMLDependencyListDiff,
  HTMLDependencyListItem,
  TagEvents,
} from "@/types/htmlDependencyManager";
import { ScriptTagManager } from "./scriptTagManager";
import { LinkTagManager } from "./linkTagManager";

export class TagManager {
  private scriptTagManager: ScriptTagManager;
  private linkTagManager: LinkTagManager;

  constructor({
    eventBus,
    document,
    scriptSrcBuilder,
    linkSrcBuilder,
  }: {
    eventBus?: EventBus<TagEvents>;
    document: Document;
    scriptSrcBuilder?: (dep: HTMLDependencyListItem) => string;
    linkSrcBuilder?: (dep: HTMLDependencyListItem) => string;
    debug?: boolean;
  }) {
    this.scriptTagManager = new ScriptTagManager({
      document,
      eventBus,
      srcBuilder: scriptSrcBuilder,
    });

    this.linkTagManager = new LinkTagManager({
      document,
      hrefBuilder: linkSrcBuilder,
    });
  }

  getScriptContainer() {
    return this.scriptTagManager.getContainer();
  }

  getLinkContainer() {
    return this.linkTagManager.getContainer();
  }

  getScriptTags() {
    return this.scriptTagManager.getTags();
  }

  getLinkTags() {
    return this.linkTagManager.getTags();
  }

  // 处理传入的标签差异
  applyDependencyDiffs(diffs: HTMLDependencyListDiff) {
    this.linkTagManager.applyDependencyDiffs(diffs);
    this.scriptTagManager.applyDependencyDiffs(diffs);
  }
}
