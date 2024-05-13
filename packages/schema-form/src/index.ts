import $ from "jquery";
import {
  ArrayInputSchemaConfig,
  EnumInputSchemaConfig,
  FormSchemaConfig,
  InputSchemaConfig,
  ObjectInputSchemaConfig,
} from "widget-up-utils";

function createInput(
  inputConfig: InputSchemaConfig,
  initialValues?: Record<string, any>
): JQuery<HTMLElement> {
  let inputElement: JQuery<HTMLElement>;
  let initialValue = initialValues
    ? initialValues[inputConfig.name]
    : undefined;

  switch (inputConfig.type) {
    case "string":
    case "number":
    case "date":
    case "color":
    case "file":
      inputElement = $(`<input type="${inputConfig.type}" />`);
      if (initialValue !== undefined) {
        inputElement.val(initialValue);
      }
      break;
    case "boolean":
      inputElement = $('<input type="checkbox" />');
      inputElement.prop("checked", initialValue === true);
      break;
    case "range":
      inputElement = $(`<input type="range" />`);
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
        radioButton.name = inputConfig.name; // 使用 inputConfig.name 以保证唯一性
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
      inputElement = $("<select></select>");
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
      inputElement = $("<div class='border'></div>");
      (
        inputConfig as ArrayInputSchemaConfig | ObjectInputSchemaConfig
      ).children?.forEach((child) => {
        inputElement.append(createInput(child, initialValues));
      });
      break;
    default:
      inputElement = $("<input />");
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
    const label = $("<label></label>").text(inputConfig.label + ": ");
    const inputElement = createInput(inputConfig, initialValues);
    const wrapper = $("<div></div>").append(label).append(inputElement);
    form.append(wrapper);
  });
  return form;
};

export default SchemaForm;
