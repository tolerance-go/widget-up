import { FormSchemaConfig } from "./form";

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
