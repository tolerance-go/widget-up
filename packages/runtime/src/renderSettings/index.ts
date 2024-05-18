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

  window.Connector_jquery3.render({
    rootElement: document.getElementById(identifierManager.rightPanelId)!,
    component: window["SchemaForm_widget-up-schema-form"]({
      formSchema,
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
      name: "widget-up-connector-jquery3",
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
