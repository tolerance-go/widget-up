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
  prefixName: string = "",
  onChange?: (
    name: string,
    value: any,
    event: JQuery.TriggeredEvent<
      HTMLElement,
      undefined,
      HTMLElement,
      HTMLElement
    >
  ) => void
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
    case "range":
      inputElement = $(
        `<input type="${inputConfig.type}" name="${fullName}" />`
      );
      if (initialValue !== undefined) {
        inputElement.val(initialValue);
      }
      if (onChange) {
        inputElement.on("input", (event) => {
          onChange(fullName, inputElement.val(), event);
        });
      }
      break;
    case "boolean":
      inputElement = $(`<input type="checkbox" name="${fullName}" />`);
      inputElement.prop("checked", initialValue === true);
      if (onChange) {
        inputElement.on("input", (event) => {
          onChange(fullName, inputElement.is(":checked"), event);
        });
      }
      break;
    case "enum":
      inputElement = $("<div></div>");
      inputConfig.options.forEach((option) => {
        const radioButton = $("<input>", {
          type: "radio",
          name: fullName,
          value: option.value,
        });
        if (option.value === initialValue) {
          radioButton.prop("checked", true);
        }
        radioButton.on("input", (event) => {
          onChange(fullName, option.value, event);
        });
        const label = $("<label>")
          .append(radioButton)
          .append(document.createTextNode(option.label));
        $(inputElement).append(label);
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
          optionElement.prop("selected", true);
        }
        inputElement.append(optionElement);
      });
      if (onChange) {
        inputElement.on("input", (event) => {
          const selectedOptions = $(event.currentTarget).val();
          onChange(fullName, selectedOptions, event);
        });
      }
      break;
    case "array":
    case "object":
      inputElement = $("<div class='border p-2'></div>");
      inputConfig.children?.forEach((child) => {
        inputElement.append(
          wrapWithLabel(
            child.label + ": ",
            createInput(child, initialValues, fullName, onChange)
          )
        );
      });
      break;
    default:
      inputElement = $(`<input name="${fullName}" />`);
      if (initialValue !== undefined) {
        inputElement.val(initialValue);
      }
      if (onChange) {
        inputElement.on("input", (event) => {
          onChange(fullName, inputElement.val(), event);
        });
      }
      break;
  }

  return inputElement;
}

const SchemaForm = ({
  formSchema,
  initialValues,
  onChange,
}: {
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
}) => {
  const form = $("<form></form>");
  formSchema?.inputs?.forEach((inputConfig) => {
    const inputElement = createInput(inputConfig, initialValues, "", onChange);
    const wrapper = wrapWithLabel(inputConfig.label + ": ", inputElement);
    form.append(wrapper);
  });
  return form;
};

export default SchemaForm;
