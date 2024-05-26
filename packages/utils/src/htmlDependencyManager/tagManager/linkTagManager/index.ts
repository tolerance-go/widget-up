import {
  HTMLDependencyListDiff,
  HTMLDependencyListItem,
  LinkTag,
} from "../../../../types/htmlDependencyManager";
import { TagManagerBase } from "../tagManagerBase";

export const LinkTagManagerContainerId = "link-tag-manager-container";

export class LinkTagManager extends TagManagerBase<LinkTag> {
  private hrefBuilder: (dep: HTMLDependencyListItem) => string; // 新增参数用于自定义构造 href

  constructor({
    document,
    hrefBuilder,
    container,
  }: {
    container?: HTMLElement;
    document: Document;
    hrefBuilder?: (dep: HTMLDependencyListItem) => string;
  }) {
    if (!container) {
      container = document.createElement("div");
      container.setAttribute("id", LinkTagManagerContainerId);
      document.body.appendChild(container);
    }
    super({ document, container }); // 调用基类构造函数
    this.hrefBuilder =
      hrefBuilder ||
      ((dep) => `https://cdn.example.com/${dep.name}@${dep.version.exact}.css`);
  }

  protected dependencyListItemToTagItem(item: HTMLDependencyListItem): LinkTag {
    return {
      type: "link",
      name: item.name,
      version: item.version.exact,
      src: this.hrefBuilder(item),
      attributes: {
        rel: "stylesheet",
      },
    };
  }
}
