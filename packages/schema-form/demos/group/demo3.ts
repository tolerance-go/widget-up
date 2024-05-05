import { JQueryComponentProps } from "widget-up-utils";
import SchemaForm from "../src";

export default ({ initialData }: JQueryComponentProps<{}>) => {
  return SchemaForm({ formSchema: {} });
};
