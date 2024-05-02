import {
  DependencyListDiff,
  DependencyListInsertionDetail,
  DependencyListItem,
  DependencyTag,
  TagDiff,
} from "../types";

export abstract class TagManagerBase<TTag extends DependencyTag> {
  protected tags: TTag[] = [];
  protected document?: Document;

  constructor({ document }: { document?: Document }) {
    this.document = document;
  }

  protected getTags(): TTag[] {
    return this.tags;
  }

  abstract applyDependencyDiffs(diffs: DependencyListDiff): void;

  abstract syncHtml(diff: TagDiff<TTag>): void;

  protected abstract dependencyListItemToTagItem(
    item: DependencyListItem
  ): TTag;

  protected convertDependencyListDiffToTagDiff(
    diff: DependencyListDiff
  ): TagDiff<TTag> {
    const dependencyListInsertionDetailToTag = (
      detail: DependencyListInsertionDetail
    ) => {
      return {
        tag: this.dependencyListItemToTagItem(detail.dep),
        prevTag: detail.prevDep
          ? this.dependencyListItemToTagItem(detail.prevDep)
          : null,
      };
    };

    return {
      insert: diff.insert.map(dependencyListInsertionDetailToTag),
      remove: diff.remove.map(this.dependencyListItemToTagItem),
      update: diff.update.map(this.dependencyListItemToTagItem),
      move: diff.move.map(dependencyListInsertionDetailToTag),
    };
  }
}
