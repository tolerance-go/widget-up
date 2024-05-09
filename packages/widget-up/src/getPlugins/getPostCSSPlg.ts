import { NormalizedConfig } from "widget-up-utils";
import postcss from "rollup-plugin-postcss";

export const getPostCSSPlg = ({ config }: { config: NormalizedConfig }) => {
  return (
    config.css &&
    postcss({
      extract: true, // 提取 CSS 到单独的文件
      ...(config.css === "modules"
        ? {
            modules: true,
          }
        : config.css === "autoModules"
        ? {
            autoModules: true,
          }
        : {}),
    })
  );
};
