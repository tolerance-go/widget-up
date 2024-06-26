WidgetUpRuntime.start({
  dependencies: [
    {
      name: "widget-up-connector-react16",
      version: "0.0.0",
      scriptSrc: () => "/connectors/connector.react16.alias-wrap.async-wrap.js",
      depends: [
        {
          name: "@widget-up-demo/react16",
          version: "0.0.0",
          scriptSrc: () => "/demos/comp.react16.alias-wrap.async-wrap.js",
          depends: [
            {
              name: "react-dom",
              version: "16.14.0",
              scriptSrc: (dep) =>
                `/libs/react-dom.development.alias-wrap.async-wrap.js`,
              depends: [
                {
                  name: "react",
                  version: "16.14.0",
                  scriptSrc: (dep) =>
                    `/libs/react.development.alias-wrap.async-wrap.js`,
                },
              ],
            },
            {
              name: "react",
              version: "16.14.0",
              scriptSrc: (dep) =>
                `/libs/react.development.alias-wrap.async-wrap.js`,
            },
          ],
        },
        {
          name: "@widget-up-demo/react16-2",
          version: "0.0.0",
          scriptSrc: () => "/demos/comp.react16-2.alias-wrap.async-wrap.js",
          depends: [
            {
              name: "react-dom",
              version: "16.14.0",
              scriptSrc: (dep) =>
                `/libs/react-dom.development.alias-wrap.async-wrap.js`,
              depends: [
                {
                  name: "react",
                  version: "16.14.0",
                  scriptSrc: (dep) =>
                    `/libs/react.development.alias-wrap.async-wrap.js`,
                },
              ],
            },
            {
              name: "react",
              version: "16.14.0",
              scriptSrc: (dep) =>
                `/libs/react.development.alias-wrap.async-wrap.js`,
            },
          ],
        },
      ],
    },
    {
      name: "widget-up-connector-react18",
      version: "0.0.0",
      scriptSrc: () => "/connectors/connector.react18.alias-wrap.async-wrap.js",
      depends: [
        {
          name: "@widget-up-demo/react18",
          version: "0.0.0",
          scriptSrc: () => "/demos/comp.react18.alias-wrap.async-wrap.js",
          depends: [
            {
              name: "react-dom",
              version: "18.2.0",
              scriptSrc: (dep) =>
                `/libs/react-dom18.development.alias-wrap.async-wrap.js`,
              depends: [
                {
                  name: "react",
                  version: "18.2.0",
                  scriptSrc: (dep) =>
                    `/libs/react18.development.alias-wrap.async-wrap.js`,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "widget-up-connector-jquery3",
      version: "0.0.0",
      scriptSrc: () => "/connectors/connector.jquery3.alias-wrap.async-wrap.js",
      depends: [
        {
          name: "@widget-up-demo/jquery3",
          version: "0.0.0",
          scriptSrc: () => "/demos/comp.jquery3.alias-wrap.async-wrap.js",
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
  ],
});
