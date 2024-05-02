import {
  DependencyListDiff,
  DependencyListItem,
  LinkTag
} from "../../types";
import { TagManagerBase } from "../TagManagerBase";

export class LinkTagManager extends TagManagerBase<LinkTag> {
  private hrefBuilder: (dep: DependencyListItem) => string; // 新增参数用于自定义构造 href

  constructor({
    document,
    hrefBuilder,
  }: {
    document: Document;
    hrefBuilder?: (dep: DependencyListItem) => string;
  }) {
    const container = document.createElement("div");
    container.setAttribute("id", "link-tag-manager-container");
    document.body.appendChild(container);

    super({ document, container: container }); // 调用基类构造函数
    this.hrefBuilder =
      hrefBuilder ||
      ((dep) => `https://cdn.example.com/${dep.name}@${dep.version}.css`);
  }

  createSelectorForTag(tag: LinkTag): string {
    // 使用 href 属性作为选择器
    return `link[href="${tag.src}"]`;
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
}
