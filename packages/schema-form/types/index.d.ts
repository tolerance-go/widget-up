import { FormSchemaConfig } from "widget-up-utils";

export type SchemaFormProps = {
  formSchema?: FormSchemaConfig;
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
