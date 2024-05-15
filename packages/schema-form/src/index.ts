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
  const wrapper = $("<div class='border-b py-1 flex items-start gap-1'></div>")
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
        `<input type="${inputConfig.type}" name="${fullName}" class="border rounded p-1" />`
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
      inputElement = $(
        `<input type="checkbox" name="${fullName}" class="mt-2"/>`
      );
      inputElement.prop("checked", initialValue === true);
      if (onChange) {
        inputElement.on("input", (event) => {
          onChange(fullName, inputElement.is(":checked"), event);
        });
      }
      break;
    case "enum":
      inputElement = $(`<div class="inline-flex flex-wrap"></div>`);
      inputConfig.options.forEach((option) => {
        const radioButton = $("<input>", {
          type: "radio",
          name: fullName,
          value: option.value,
          class: "mr-1.5",
        });
        if (option.value === initialValue) {
          radioButton.prop("checked", true);
        }
        radioButton.on("input", (event) => {
          onChange?.(fullName, option.value, event);
        });
        const label = $("<label class='mr-4'>")
          .append(radioButton)
          .append(document.createTextNode(option.label));
        $(inputElement).append(label);
      });
      break;
    case "select":
      inputElement = $(
        `<select name="${fullName}" class="border rounded p-1"></select>`
      );
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
      inputElement = $("<div class='array-input border p-2'></div>");
      const addButton = $(
        "<button type='button' class='bg-blue-500 text-white px-2 py-1 rounded my-1'>新增</button>"
      ).on("click", () => {
        const newItemWrapper = createArrayItem(
          inputConfig,
          fullName,
          {},
          onChange,
          inputElement.children(".array-item").length
        );
        inputElement.append(newItemWrapper);
        if (onChange) {
          onChange(fullName, getArrayValues(inputElement), $.Event("add"));
        }
      });
      inputElement.append(addButton);

      if (initialValue) {
        initialValue.forEach((itemValue: any, index: number) => {
          const itemWrapper = createArrayItem(
            inputConfig,
            fullName,
            itemValue,
            onChange,
            index
          );
          inputElement.append(itemWrapper);
        });
      }
      break;
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
      inputElement = $(
        `<input name="${fullName}" class="border rounded p-1" />`
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
  }

  return inputElement;
}

function createArrayItem(
  inputConfig: ArrayInputSchemaConfig,
  prefixName: string,
  initialValues: any,
  onChange?: (
    name: string,
    value: any,
    event: JQuery.TriggeredEvent<
      HTMLElement,
      undefined,
      HTMLElement,
      HTMLElement
    >
  ) => void,
  index?: number
): JQuery<HTMLElement> {
  // Create the main wrapper with flex and align items center
  const itemWrapper = $(
    "<div class='array-item border p-2 mb-2 flex items-center gap-1'></div>"
  );
  const itemPrefixName = `${prefixName}[${index}]`;

  // Create the inner wrapper to hold the input elements
  const itemInner = $("<div class='item-inner flex-grow'></div>");
  inputConfig.children?.forEach((child) => {
    itemInner.append(
      wrapWithLabel(
        child.label + ": ",
        createInput(child, initialValues, itemPrefixName, onChange)
      )
    );
  });

  // Create the remove button
  const removeButton = $(
    "<button type='button' class='bg-red-500 text-white px-2 py-1 rounded my-1'>删除</button>"
  ).on("click", () => {
    itemWrapper.remove();
    if (onChange) {
      onChange(
        prefixName,
        getArrayValues(itemWrapper.parent()),
        $.Event("remove")
      );
    }
  });

  // Append the itemInner and removeButton to itemWrapper
  itemWrapper.append(itemInner).append(removeButton);

  return itemWrapper;
}

function getArrayValues(arrayElement: JQuery<HTMLElement>): any[] {
  const values: any[] = [];
  arrayElement.find(".array-item").each((index, element) => {
    const itemValues: Record<string, any> = {};
    $(element)
      .find("input, select")
      .each((_, inputElement) => {
        const name = $(inputElement).attr("name")?.split(".").pop() ?? "";
        const value = $(inputElement).val();
        if ($(inputElement).attr("type") === "checkbox") {
          itemValues[name] = $(inputElement).is(":checked");
        } else {
          itemValues[name] = value;
        }
      });
    values.push(itemValues);
  });
  return values;
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
