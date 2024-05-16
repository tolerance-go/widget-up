import SchemaForm from "widget-up-schema-form";

const Demo3 = () => {
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
export default Demo3;
export { Demo3 as Component };
