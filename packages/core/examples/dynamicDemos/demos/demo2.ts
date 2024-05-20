import SchemaForm from "widget-up-schema-form";

const Demo2 = () => {
  return SchemaForm({
    formSchema: {
      inputs: [
        {
          type: "string",
          label: "string",
          name: "string",
        },
      ],
    },
  });
};

export default Demo2;
export { Demo2 as Component };
