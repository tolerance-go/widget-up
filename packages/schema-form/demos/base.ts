import SchemaForm from "widget-up-schema-form";

const Demo1 = () => {
  return SchemaForm({
    formSchema: {
      inputs: [
        {
          name: "string",
          type: "string",
          label: "String",
          initialValue: "Initial String",
        },
        {
          name: "number",
          type: "number",
          label: "Number",
          initialValue: 42,
        },
        {
          name: "date",
          type: "date",
          label: "Date",
          initialValue: "2021-04-01",
        },
        {
          name: "color",
          type: "color",
          label: "Color",
          initialValue: "#ff0000",
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
          initialValue: true,
        },
        {
          name: "range",
          type: "range",
          label: "Range",
          initialValue: 50,
        },
        {
          name: "enum",
          type: "enum",
          label: "Enum",
          initialValue: "option1",
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
          initialValue: ["option1"],
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

export default Demo1;
export { Demo1 as Component };
