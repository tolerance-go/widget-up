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
            window.Register_jquery3.render({
              rootElement: rightPanel,
              component: window['SchemaForm_widget-up-schema-form']({}).get(0)
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
