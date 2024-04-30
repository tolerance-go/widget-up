WidgetUpRuntime.start({
  dependencies: [
    {
      name: "widget-up-input-react16",
      version: "0.0.0",
      scriptSrc: () => "/input.react16.js",
      depends: [
        {
          name: "@widget-up-demo/react16",
          version: "0.0.0",
          scriptSrc: () => "/comp.react16.js",
          depends: [
            {
              name: "react-dom",
              version: "^16.14.0",
              scriptSrc: (dep) =>
                `/react-dom.development.js`,
              depends: [
                {
                  name: "react",
                  version: "^16.14.0",
                  scriptSrc: (dep) =>
                    `/react.development.js`,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});
