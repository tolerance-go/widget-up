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

  protected updateTags(diffs: TagDiff<TTag>) {
    diffs.insert.forEach((insertDetail) => {
      this.insertTag(insertDetail.tag, insertDetail.prevTag);
    });

    this.moveTags(diffs);
    diffs.remove.forEach((tag) => this.removeTag(tag.src));
    diffs.update.forEach((tag) => this.updateTag(tag));
  }

  abstract updateHtml(diff: TagDiff<TTag>): void;

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

  protected moveTags(diffs: TagDiff<TTag>) {
    // 遍历 move 数组，对每个需要移动的标签进行处理
    diffs.move.forEach((moveDetail) => {
      // 首先找到需要移动的标签的当前位置
      const currentIndex = this.tags.findIndex(
        (t) => t.src === moveDetail.tag.src
      );
      if (currentIndex === -1) {
        throw new Error(`Tag "${moveDetail.tag.src}" not found.`);
      }
      // 移除当前位置的标签
      const [movingTag] = this.tags.splice(currentIndex, 1);

      // 确定新的插入位置
      if (moveDetail.prevTag === null) {
        // 如果 prevSrc 为 null，插入到数组的第一个位置
        this.tags.unshift(movingTag);
      } else {
        // 找到 prevSrc 对应的标签的索引，然后在其后面插入新标签
        const beforeIndex = this.tags.findIndex(
          (t) => t.src === moveDetail.prevTag!.src
        );
        if (beforeIndex >= 0) {
          this.tags.splice(beforeIndex + 1, 0, movingTag);
        } else {
          // 如果找不到 prevSrc 指定的标签，可以选择抛出错误或者默认行为（如插入到末尾）
          // 这里选择抛出错误
          throw new Error(
            `prevSrc tag "${moveDetail.prevTag.src}" not found in the tags list.`
          );
        }
      }
    });
  }

  // 插入标签
  protected insertTag(tag: TTag, prevTag: TTag | null) {
    if (prevTag === null) {
      // 如果 beforeSrc 为 null，插入到数组的第一个位置
      this.tags.unshift({ ...tag, loaded: false, executed: false });
    } else {
      // 找到 beforeSrc 对应的标签的索引，然后在其后面插入新标签
      const beforeIndex = this.tags.findIndex((t) => t.src === prevTag.src);
      if (beforeIndex >= 0) {
        this.tags.splice(beforeIndex + 1, 0, {
          ...tag,
          loaded: false,
          executed: false,
        });
      } else {
        // 如果找不到 beforeSrc 指定的标签，可以选择抛出错误或者默认行为（如插入到末尾）
        // 这里选择抛出错误
        throw new Error(
          `beforeSrc tag "${prevTag.src}" not found in the tags list.`
        );
      }
    }
  }

  // 移除标签
  protected removeTag(src: string) {
    this.tags = this.tags.filter((tag) => tag.src !== src);
  }

  // 更新标签
  protected updateTag(tag: TTag) {
    const index = this.tags.findIndex((t) => t.src === tag.src);
    if (index !== -1) {
      this.tags[index] = {
        ...tag,
      };
    }
  }
}
