WidgetUpRuntime.start([
  {
    name: "widget-up-input-react16",
    version: "0.0.0",
    scriptSrc: "/input.react16.js",
    depends: [
      {
        name: "@widget-up-demo/react16",
        version: "0.0.0",
        scriptSrc: "/comp.react16.js",
        depends: [
          {
            name: "react",
            version: "^16.14.0",
            scriptSrc: (dep) =>
              `https://unpkg.com/react@${dep.version}/umd/react.development.js`,
          },
          {
            name: "react-dom",
            version: "^16.14.0",
            scriptSrc: (dep) =>
              `https://unpkg.com/react-dom@${dep.version}/umd/react-dom.development.js`,
          },
        ],
      },
    ],
  },
]);
