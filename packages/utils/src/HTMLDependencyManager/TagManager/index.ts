import { EventBus } from "@/src/EventBus";
import { DependencyListDiff, DependencyListItem } from "../types";
import { ScriptTagManager } from "./ScriptTagManager";
import { LinkTagManager } from "./LinkTagManager";

export interface TagEvents {
  loaded: { id: string };
  execute: { id: string };
  executed: { id: string };
}

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
    document?: Document;
    scriptSrcBuilder?: (dep: DependencyListItem) => string;
    linkSrcBuilder?: (dep: DependencyListItem) => string;
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

  getScriptTags() {
    return this.scriptTagManager.getTags();
  }

  getLinkTags() {
    return this.linkTagManager.getTags();
  }

  // 处理传入的标签差异
  applyDependencyDiffs(diffs: DependencyListDiff) {
    this.linkTagManager.applyDependencyDiffs(diffs);
    this.scriptTagManager.applyDependencyDiffs(diffs);
  }
}
