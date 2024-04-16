import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function customHtmlPlugin({
  globals,
  src,
  dest,
  packageConfig,
  config,
}) {
  return {
    name: "custom-html", // 插件名称
    generateBundle() {
      // 读取 EJS 模板文件
      const templatePath = path.join(__dirname, src);
      ejs.renderFile(
        templatePath,
        {
          scriptTags: Object.entries(globals).map(([key, value]) => {
            return {
              src: `https://unpkg.com/${key}@${packageConfig.dependencies[key]}/umd/${key}.production.min.js`,
              global: `window.${globals[key]} = ${config.external[key]};`,
            };
          }),
          bundleSrc: "./umd/index.js",
          includeCSS: !!config.css,
        },
        (err, html) => {
          if (err) {
            console.error("Error rendering EJS template:", err);
            return;
          }

          const dist = path.resolve(dest);

          fs.ensureDirSync(dist);
          // 写入生成的 HTML 到目标目录
          fs.writeFileSync(path.join(dist, "index.html"), html, "utf8");
        }
      );
    },
  };
}
