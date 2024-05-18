import { FormSchemaConfig } from "widget-up-utils";
import { globalEventBus } from "../events";
import { identifierManager } from "../identifierManager";
import { DependencyTreeNode } from "../install";
import { pathManager } from "../pathManager";

async function fetchFormSchema(): Promise<FormSchemaConfig> {
  const response = await fetch(pathManager.formSchemaUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch menus");
  }
  return response.json();
}

// 初始化右侧表单
const init = async () => {
  const formSchema = await fetchFormSchema();

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

  window.Connector_jquery3.render({
    rootElement: document.getElementById(identifierManager.rightPanel)!,
    component: window["SchemaForm_widget-up-schema-form"]({
      formSchema,
      initialValues, // 传递初始化值
      onChange(name, value, event) {
        console.log(name, value, event);
      },
    }).get(0),
  });
};

export const renderSettings = () => {
  globalEventBus.on(
    "rightPanelMounted",
    ({ rightPanel }) => {
      globalEventBus.on(
        "executed",
        (event) => {
          if (
            event.id === "/connectors/input.jquery3.alias-wrap.async-wrap.js"
          ) {
            init();
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
