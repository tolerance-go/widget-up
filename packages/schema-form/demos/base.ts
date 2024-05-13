import SchemaForm from "widget-up-schema-form";

const Demo1 = () => {
  return SchemaForm({
    formSchema: {
      inputs: [
        {
          type: "string",
          label: "string",
        },
        {
          type: "number",
          label: "number",
        },
        {
          type: "date",
          label: "date",
        },
        {
          type: "color",
          label: "color",
        },
        {
          type: "file",
          label: "file",
        },
        {
          type: "boolean",
          label: "boolean",
        },
        {
          type: "range",
          label: "range",
        },
        {
          type: "enum",
          label: "enum",
          options: [
            {
              label: "option1",
              value: "option1",
            },
            {
              label: "option2",
              value: "option2",
            },
          ],
        },
        {
          type: "select",
          label: "select",
          options: [
            {
              label: "option1",
              value: "option1",
            },
            {
              label: "option2",
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
