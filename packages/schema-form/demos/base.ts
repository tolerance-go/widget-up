import SchemaForm from "widget-up-schema-form";

const Demo1 = () => {
  return SchemaForm({
    formSchema: {
      inputs: [
        {
          type: "string",
          label: "string",
        },
      ],
    },
  });
};

export default Demo1;
export { Demo1 as Component };
