import { HTMLDependencyManager } from "widget-up-utils";
import { SchemaFormProps } from "widget-up-schema-form";

export {};

declare global {
  interface Window {
    RuntimeComponent: {
      Component: any; // You can replace 'any' with a more specific type if known
    };

    __manager?: HTMLDependencyManager;

    Register_jquery3: {
      render: (args: {
        rootElement: HTMLElement;
        component?: HTMLElement;
      }) => void;
      unmount: (args: { rootElement: HTMLElement }) => void;
    };

    "SchemaForm_widget-up-schema-form": (
      props: SchemaFormProps
    ) => JQuery<HTMLElement>;
  }
}
