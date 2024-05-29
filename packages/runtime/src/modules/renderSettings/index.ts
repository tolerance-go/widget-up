import { BuildEnv, HTMLDependency, FormSchemaConfig } from "widget-up-utils";
import { globalEventBus } from "../events";
import { identifierManager } from "@/src/managers/identifierManager";
import { pathManager } from "@/src/managers/pathManager";
import { EnvManager } from "@/src/managers/envManager";

async function fetchFormSchema(): Promise<FormSchemaConfig> {
  const response = await fetch(pathManager.formSchemaUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch menus");
  }
  return response.json();
}

// 初始化右侧表单
const init = async () => {
  const envManager = EnvManager.getInstance();
  const formSchema = await fetchFormSchema();

  const schemaFormComponentGlobal =
    envManager.BuildEnv === "development"
      ? "SchemaForm_widget-up-schema-form"
      : "SchemaForm_v1_0_0";

  window.Connector_jquery3.render({
    rootElement: document.getElementById(identifierManager.rightPanelId)!,
    component: window[schemaFormComponentGlobal]({
      formSchema,
      onChange(name, value, event) {
        if (window.WidgetUpLib_v0_0_0) {
          window.WidgetUpLib_v0_0_0.formSettings.emit("changed", {
            name,
            value,
            event,
          });
        }
        console.log(name, value, event);
      },
    }).get(0),
  });
};

export const renderSettings = () => {
  const envManager = EnvManager.getInstance();

  globalEventBus.on(
    "rightPanelMounted",
    ({ rightPanel }) => {
      globalEventBus.on(
        "executed",
        (event) => {
          if (
            event.id ===
            (envManager.BuildEnv === "development"
              ? "/connectors/connector.jquery3.alias-wrap.async-wrap.js"
              : "/connectors/widget-up-connector-jquery3_v0_0_0.js")
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
  dependencies: HTMLDependency[],
  buildEnv: BuildEnv
): HTMLDependency[] => {
  if (buildEnv === "development") {
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
  }

  return dependencies;
};
