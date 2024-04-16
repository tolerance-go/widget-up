import fs from "fs";
import path from "path";

export function customHtmlPlugin({ globals, src, dest, packageConfig, config }) {
  return {
    name: "custom-html", // 插件名称
    generateBundle() {
      const originalHtml = fs.readFileSync(path.resolve(src), "utf8");

      const scriptTags = Object.entries(globals)
        .map(([key, value]) => {
          return [
            `<script src="https://unpkg.com/${key}@${packageConfig.dependencies[key]}/umd/${key}.production.min.js"></script>`,
            `<script>window.${globals[key]} = ${config.external[key]};</script>`,
          ].join("\n");
        })
        .join("\n");

      const newHtml = originalHtml.replace(
        "</body>",
        [scriptTags, '<script src="./bundle.js"></script>', "</body>"].join(
          "\n"
        )
      );

      fs.writeFileSync(path.resolve(dest, "index.html"), newHtml, "utf8");
    },
  };
}
