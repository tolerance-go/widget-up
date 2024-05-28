import { HTMLDependencyManager, SchemaFormProps } from "widget-up-utils";

export {};

declare global {
  interface Window {
    RuntimeComponent: {
      Component: any; // You can replace 'any' with a more specific type if known
    };

    __manager?: HTMLDependencyManager;

    Connector_jquery3: {
      render: (args: {
        rootElement: HTMLElement;
        component?: HTMLElement;
      }) => void;
      unmount: (args: { rootElement: HTMLElement }) => void;
    };

    "SchemaForm_widget-up-schema-form": (
      props: SchemaFormProps
    ) => JQuery<HTMLElement>;

    SchemaForm_v1_0_0: (props: SchemaFormProps) => JQuery<HTMLElement>;
  }
}
