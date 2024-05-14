import $ from "jquery";
import { FormSchemaConfig } from "widget-up-utils";
import "@/styles/index.less";

// 更新 SchemaForm 组件以接受 initialValues 作为参数
const SchemaForm = ({
  formSchema,
  initialValues,
}: {
  formSchema?: FormSchemaConfig;
  initialValues?: Record<string, any>;
}) => {
  return $("<div class='border-b py-4'></div>");
};

export default SchemaForm;
