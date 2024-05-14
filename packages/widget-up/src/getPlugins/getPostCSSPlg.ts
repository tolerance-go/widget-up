import { NormalizedConfig } from "widget-up-utils";
import postcss, { PostCSSPluginConf } from "rollup-plugin-postcss";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export const getPostCSSPlg = async ({
  config,
}: {
  config: NormalizedConfig;
}) => {
  const plugins = [];

  // 检查 CSS 配置并相应设置插件
  if (config.css) {
    // 如果配置了 Tailwind CSS 并指定了配置文件，则动态导入配置
    if (typeof config.css === "object" && config.css.useTailwind) {
      const tailwindOptions = config.css.tailwindConfigPath
        ? await import(config.css.tailwindConfigPath).then(
            (m) => m.default || m
          )
        : {
            content: ["./src/**/*.{html,ts}"],
            theme: {
              extend: {},
            },
            plugins: [],
          };
      plugins.push(tailwindcss(tailwindOptions)); // 使用 Tailwind CSS 配置
    }

    plugins.push(autoprefixer()); // 总是添加 Autoprefixer 插件

    // 准备带扩展类型的 PostCSS 配置选项
    const postCssOptions: PostCSSPluginConf = {
      extract: true, // 提取 CSS 到单独文件
      plugins,
      extensions: [".css", ".less"],
    };

    // 根据配置条件添加模块化配置
    if (typeof config.css === "object") {
      if (config.css.modules) {
        postCssOptions.modules = true;
      } else if (config.css.autoModules) {
        postCssOptions.autoModules = true;
      }
    }

    return postcss(postCssOptions);
  }

  // 如果没有 CSS 配置，则返回 null 或适当的值
  return null;
};
