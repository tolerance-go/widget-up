export type JQueryComponentProps<T extends object> = { initialData?: any } & T;

export type JQueryComponent<T extends object> = (
  args: JQueryComponentProps<T>
) => HTMLElement;
