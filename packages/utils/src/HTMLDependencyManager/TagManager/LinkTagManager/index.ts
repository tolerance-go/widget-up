import { DependencyListDiff, DependencyListItem, LinkTag } from "../../../../types/HTMLDependencyManager";
import { TagManagerBase } from "../TagManagerBase";

export const LinkTagManagerContainerId = "link-tag-manager-container";

export class LinkTagManager extends TagManagerBase<LinkTag> {
  private hrefBuilder: (dep: DependencyListItem) => string; // 新增参数用于自定义构造 href

  constructor({
    document,
    hrefBuilder,
    container,
  }: {
    container?: HTMLElement;
    document: Document;
    hrefBuilder?: (dep: DependencyListItem) => string;
  }) {
    if (!container) {
      container = document.createElement("div");
      container.setAttribute("id", LinkTagManagerContainerId);
      document.body.appendChild(container);
    }
    super({ document, container }); // 调用基类构造函数
    this.hrefBuilder =
      hrefBuilder ||
      ((dep) => `https://cdn.example.com/${dep.name}@${dep.version}.css`);
  }

  createSelectorForTag(tag: LinkTag): string {
    // 使用 href 属性作为选择器
    return `link[href="${tag.src}"]`;
  }

  protected dependencyListItemToTagItem(item: DependencyListItem): LinkTag {
    return {
      type: "link",
      name: item.name,
      version: item.version,
      src: this.hrefBuilder(item),
      attributes: {
        rel: "stylesheet",
      },
    };
  }
}
