import { JQueryComponentProps } from "widget-up-lib";
import SchemaForm from "../src";

export default ({ initialData }: JQueryComponentProps<{}>) => {
  return SchemaForm({ formSchema: {} });
};
