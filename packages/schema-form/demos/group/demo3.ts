import SchemaForm from "widget-up-schema-form";

const Demo3 = () => {
  return SchemaForm({
    formSchema: {
      inputs: [
        {
          name: "string",
          type: "string",
          label: "String",
        },
        {
          name: "number",
          type: "number",
          label: "Number",
        },
        {
          name: "date",
          type: "date",
          label: "Date",
        },
        {
          name: "color",
          type: "color",
          label: "Color",
        },
        {
          name: "file",
          type: "file",
          label: "File",
        },
        {
          name: "boolean",
          type: "boolean",
          label: "Boolean",
        },
        {
          name: "range",
          type: "range",
          label: "Range",
        },
        {
          name: "enum",
          type: "enum",
          label: "Enum",
          options: [
            {
              label: "Option 1",
              value: "option1",
            },
            {
              label: "Option 2",
              value: "option2",
            },
          ],
        },
        {
          name: "select",
          type: "select",
          label: "Select",
          options: [
            {
              label: "Option 1",
              value: "option1",
            },
            {
              label: "Option 2",
              value: "option2",
            },
          ],
        },
      ],
    },
  });
};
export default Demo3;
export { Demo3 as Component };
