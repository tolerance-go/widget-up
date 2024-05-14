import $ from "jquery";
import {
  ArrayInputSchemaConfig,
  EnumInputSchemaConfig,
  FormSchemaConfig,
  InputSchemaConfig,
  ObjectInputSchemaConfig,
} from "widget-up-utils";
import "../styles/index.less";

function wrapWithLabel(
  labelText: string,
  inputElement: JQuery<HTMLElement>
): JQuery<HTMLElement> {
  const label = $("<label></label>").text(labelText);
  const wrapper = $("<div class='border-b py-1'></div>")
    .append(label)
    .append(inputElement);
  return wrapper;
}

function createInput(
  inputConfig: InputSchemaConfig,
  initialValues?: Record<string, any>,
  prefixName: string = "" // 新增参数，用于传递字段名称前缀
): JQuery<HTMLElement> {
  let inputElement: JQuery<HTMLElement>;
  const fullName = prefixName
    ? `${prefixName}.${inputConfig.name}`
    : inputConfig.name;

  let initialValue = initialValues
    ? initialValues[inputConfig.name]
    : undefined;

  switch (inputConfig.type) {
    case "string":
    case "number":
    case "date":
    case "color":
    case "file":
      inputElement = $(`<input type="${inputConfig.type}" name="${fullName}" />`);
      if (initialValue !== undefined) {
        inputElement.val(initialValue);
      }
      break;
    case "boolean":
      inputElement = $(`<input type="checkbox" name="${fullName}" />`);
      inputElement.prop("checked", initialValue === true);
      break;
    case "range":
      inputElement = $(`<input type="range" name="${fullName}" />`);
      if (initialValue !== undefined) {
        inputElement.val(initialValue);
      }
      break;
    case "enum":
      inputElement = $("<div></div>");
      inputConfig.options.forEach((option) => {
        const radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.value = option.value + "";
        radioButton.name = fullName; // 更新 name 为全路径
        if (option.value === initialValue) {
          radioButton.checked = true;
        }

        const label = document.createElement("label");
        label.appendChild(radioButton);
        label.appendChild(document.createTextNode(option.label));
        inputElement.append(label);
      });
      break;
    case "select":
      inputElement = $(`<select name="${fullName}"></select>`);
      if (inputConfig.multiSelect) {
        inputElement.attr("multiple", "multiple");
      }
      inputConfig.options.forEach((option) => {
        const optionElement = $(
          `<option value="${option.value}">${option.label}</option>`
        );
        if (initialValue?.includes(option.value)) {
          optionElement.attr("selected", "selected");
        }
        inputElement.append(optionElement);
      });
      break;
    case "array":
    case "object":
      inputElement = $("<div class='border p-2'></div>");
      inputConfig.children?.forEach((child) => {
        inputElement.append(
          wrapWithLabel(child.label + ": ", createInput(child, initialValues, fullName))
        );
      });
      break;
    default:
      inputElement = $(`<input name="${fullName}" />`);
      if (initialValue !== undefined) {
        inputElement.val(initialValue);
      }
      break;
  }

  return inputElement;
}

// 更新 SchemaForm 组件以接受 initialValues 作为参数
const SchemaForm = ({
  formSchema,
  initialValues,
}: {
  formSchema?: FormSchemaConfig;
  initialValues?: Record<string, any>;
}) => {
  const form = $("<form></form>");
  formSchema?.inputs?.forEach((inputConfig) => {
    const inputElement = createInput(inputConfig, initialValues);
    const wrapper = wrapWithLabel(inputConfig.label + ": ", inputElement);
    form.append(wrapper);
  });
  return form;
};

export default SchemaForm;
