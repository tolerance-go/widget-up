import SchemaForm from "widget-up-schema-form";

const Demo2 = () => {
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
        {
          name: "array",
          type: "array",
          label: "array",
          children: [
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
            {
              name: "object",
              type: "object",
              label: "object",
              children: [
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
                {
                  name: "array",
                  type: "array",
                  label: "array",
                  children: [
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
              ],
            },
          ],
        },
        {
          name: "object",
          type: "object",
          label: "object",
          children: [
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
            {
              name: "array",
              type: "array",
              label: "array",
              children: [
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
          ],
        },
      ],
    },
    onChange(name, value, event) {
      console.log(name, value, event);
    },
  });
};

export default Demo2;
export { Demo2 as Component };
