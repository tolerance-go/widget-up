WidgetUpRuntime.start({
  dependencies: [
    {
      name: "widget-up-input-react16",
      version: "0.0.0",
      scriptSrc: () => "/libs/input.react16.wrap.js",
      depends: [
        {
          name: "@widget-up-demo/react16",
          version: "0.0.0",
          scriptSrc: () => "/libs/comp.react16.wrap.js",
          depends: [
            {
              name: "react-dom",
              version: "16.14.0",
              scriptSrc: (dep) =>
                `/libs/react-dom.development.wrap.js`,
              depends: [
                {
                  name: "react",
                  version: "16.14.0",
                  scriptSrc: (dep) =>
                    `/libs/react.development.wrap.js`,
                },
              ],
            },
          ],
        },
        {
          name: "@widget-up-demo/react16-2",
          version: "0.0.0",
          scriptSrc: () => "/libs/comp.react16-2.wrap.js",
          depends: [
            {
              name: "react-dom",
              version: "16.14.0",
              scriptSrc: (dep) =>
                `/libs/react-dom.development.wrap.js`,
              depends: [
                {
                  name: "react",
                  version: "16.14.0",
                  scriptSrc: (dep) =>
                    `/libs/react.development.wrap.js`,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});
