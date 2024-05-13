import SchemaForm from "widget-up-schema-form";

const Demo1 = () => {
  // 定义表单的初始化值
  const initialValues = {
    string: "Initial String",
    number: 42,
    date: "2021-04-01",
    color: "#ff0000",
    file: null, // 文件类型的初始值通常是 null 或空字符串
    boolean: true,
    range: 50,
    enum: "option1",
    select: ["option1"], // select 的初始值为数组形式，尤其是对于多选情况
  };

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
    initialValues: initialValues, // 传递初始化值
  });
};

export default Demo1;
export { Demo1 as Component };
