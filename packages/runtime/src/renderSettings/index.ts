import { globalEventBus } from "../globalEventBus";
import { DependencyTreeNode } from "../install";

export const renderSettings = () => {
  globalEventBus.on(
    "rightPanelMounted",
    ({ rightPanel }) => {
      globalEventBus.on(
        "executed",
        (event) => {
          if (event.id === "/libs/input.jquery3.alias-wrap.async-wrap.js") {
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

            window.Register_jquery3.render({
              rootElement: rightPanel,
              component: window["SchemaForm_widget-up-schema-form"]({
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
                initialValues: initialValues, // 传递初始化值
                onChange(name, value, event) {
                  console.log(name, value, event);
                },
              }).get(0),
            });
          }
        },
        {
          // 如果已经发生过该事件立即执行
          immediate: true,
        }
      );
    },
    {
      immediate: true,
    }
  );
};

export const applyDependencies = (
  dependencies: DependencyTreeNode[]
): DependencyTreeNode[] => {
  return [
    {
      name: "widget-up-input-jquery3",
      version: "0.0.0",
      scriptSrc: () => "/libs/input.jquery3.alias-wrap.async-wrap.js",
      depends: [
        {
          name: "widget-up-schema-form",
          version: "0.0.0",
          scriptSrc: () =>
            "/libs/widget-up-schema-form.alias-wrap.async-wrap.js",
          linkHref: () => "/libs/widget-up-schema-form.css",
          depends: [
            {
              name: "jquery",
              version: "3.7.1",
              scriptSrc: (dep) => `/libs/jquery.alias-wrap.async-wrap.js`,
            },
          ],
        },
      ],
    },
    ...dependencies,
  ];
};
