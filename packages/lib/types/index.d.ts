export interface JQueryComponent {
  start?: (args: {
    rootElement: HTMLElement;
    settings: Record<string, any>;
  }) => void;
}
