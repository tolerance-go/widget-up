// 定义事件类型和相关数据
export interface FormSettingsEvents {
  changed: {
    name: string;
    value: any;
    event: JQuery.TriggeredEvent<
      HTMLElement,
      undefined,
      HTMLElement,
      HTMLElement
    >;
  };
}
