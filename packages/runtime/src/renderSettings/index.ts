import { DependencyTreeNode } from "../install";

export const renderSettings = () => {};

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
        },
      ],
    },
    ...dependencies,
  ];
};
