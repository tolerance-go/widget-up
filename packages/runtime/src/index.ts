import { EventBus } from "widget-up-utils";
import '@/styles/index.less'

export type GlobalEvents = {
  onClickMenuItem: {
    key: string;
  };
};

export const globalEventBus = new EventBus<GlobalEvents>();

export type JQueryComponentProps<T extends object> = { initialData?: any } & T;

export const JQueryComponent = <T extends object = object>(
  props: JQueryComponentProps<T>,
): JQuery<HTMLElement> => {
  throw new Error("runtime code");
};

export type HTMLComponentProps<T extends object> = { initialData?: any } & T;

export const HTMLComponent = <T extends object = object>(
  props: HTMLComponentProps<T>,
): HTMLElement => {
  throw new Error("runtime code");
};

export const main = () => {
  // 请求跟目录下的 menus.json 然后渲染左边栏菜单
}
