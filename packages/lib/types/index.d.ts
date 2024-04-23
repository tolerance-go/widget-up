export type JQueryComponent<T extends object> = (
  args: { initialData?: any } & T
) => HTMLElement;

export * from "./form";
