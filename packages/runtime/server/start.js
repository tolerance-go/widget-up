WidgetUpRuntime.start({
  dependencies: [
    {
      name: "widget-up-input-react16",
      version: "0.0.0",
      scriptSrc: () => "/input.react16.wrap.js",
      depends: [
        {
          name: "@widget-up-demo/react16",
          version: "0.0.0",
          scriptSrc: () => "/comp.react16.wrap.js",
          depends: [
            {
              name: "react-dom",
              version: "16.14.0",
              scriptSrc: (dep) =>
                `/react-dom.development.wrap.js`,
              depends: [
                {
                  name: "react",
                  version: "16.14.0",
                  scriptSrc: (dep) =>
                    `/react.development.wrap.js`,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});
