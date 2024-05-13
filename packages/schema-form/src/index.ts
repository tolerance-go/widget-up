import $ from "jquery";
import {
  ArrayInputSchemaConfig,
  EnumInputSchemaConfig,
  FormSchemaConfig,
  InputSchemaConfig,
  ObjectInputSchemaConfig,
} from "widget-up-utils";

// 创建具体的输入元素
function createInput(inputConfig: InputSchemaConfig): JQuery<HTMLElement> {
  let inputElement: JQuery<HTMLElement>;
  switch (inputConfig.type) {
    case "string":
    case "number":
    case "date":
    case "color":
    case "file":
      inputElement = $(`<input type="${inputConfig.type}" />`);
      break;
    case "boolean":
      inputElement = $('<input type="checkbox" />');
      if (inputConfig.initialValue) {
        inputElement.prop("checked", inputConfig.initialValue);
      }
      break;
    case "range":
      inputElement = $(`<input type="range" />`);
      break;
    case "enum":
      inputElement = $("<div></div>");

      inputConfig.options.forEach((option) => {
        // 创建单选按钮
        const radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.value = option.value + '';
        radioButton.name = "inputOptions"; // 确保所有单选按钮有相同的 name

        // 创建标签
        const label = document.createElement("label");
        label.appendChild(radioButton);
        label.appendChild(document.createTextNode(option.label));

        // 将单选按钮和标签添加到容器中
        inputElement.append(label);
      });
      break;
    case "select":
      inputElement = $("<select></select>");
      if (inputConfig.multiSelect) {
        inputElement.attr("multiple", "multiple");
      }
      inputConfig.options.forEach((option) => {
        inputElement.append(
          $(`<option value="${option.value}">${option.label}</option>`)
        );
      });
      break;
    case "array":
    case "object":
      // 递归创建表单组件以处理嵌套数据结构
      inputElement = $("<div></div>");
      (
        inputConfig as ArrayInputSchemaConfig | ObjectInputSchemaConfig
      ).children?.forEach((child) => {
        inputElement.append(createInput(child));
      });
      break;
    default:
      inputElement = $("<input />");
      break;
  }

  if (
    inputConfig.initialValue !== undefined &&
    inputConfig.type !== "boolean"
  ) {
    inputElement.val(inputConfig.initialValue as any);
  }

  return inputElement;
}

// 定义 SchemaForm 组件
const SchemaForm = ({ formSchema }: { formSchema?: FormSchemaConfig }) => {
  const form = $("<form></form>");
  formSchema?.inputs?.forEach((inputConfig) => {
    const label = $("<label></label>").text(inputConfig.label + ": ");
    const inputElement = createInput(inputConfig);
    const wrapper = $("<div></div>").append(label).append(inputElement);
    form.append(wrapper);
  });
  return form;
};

export default SchemaForm;
