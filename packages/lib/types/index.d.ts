export interface JQueryComponent {
  start?: (args: {
    rootElement: HTMLElement;
  }) => void;
  update?: (args: {
    settings: Record<string, any>;
  }) => void;
}
