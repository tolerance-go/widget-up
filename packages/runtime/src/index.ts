export type JQueryComponentProps<T extends object> = { initialData?: any } & T;

export const JQueryComponent = <T extends object = object>(
  props: JQueryComponentProps<T>,
): HTMLElement => {
  return null as unknown as HTMLElement;
};
