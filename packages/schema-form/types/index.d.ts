import { FormSchemaConfig } from "widget-up-utils";

export type SchemaFormProps = {
  formSchema?: FormSchemaConfig;
  initialValues?: Record<string, any>;
  onChange?: (
    name: string,
    value: any,
    event: JQuery.TriggeredEvent<
      HTMLElement,
      undefined,
      HTMLElement,
      HTMLElement
    >
  ) => void;
};
