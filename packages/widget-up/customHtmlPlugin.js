import fs from "fs";
import path from "path";

export function customHtmlPlugin({ globals, src, dest, dependencies }) {
  return {
    name: "custom-html", // 插件名称
    generateBundle() {
      const originalHtml = fs.readFileSync(path.resolve(src), "utf8");

      const scriptTags = Object.entries(globals)
        .map(([key, value]) => {
          const url = value.url;
          return [
            `<script src="https://unpkg.com/${key}@${dependencies[key]}/umd/${key}.production.min.js"></script>`,
            `<script>window.${globals[key]} = ${config.external[key]};</script>`,
          ].join("\n");
        })
        .join("\n");

      const newHtml = originalHtml.replace(
        "</body>",
        `  ${scriptTags}\n  <script src="./bundle.js"></script>\n</body>`
      );

      fs.writeFileSync(path.resolve(dest, "index.html"), newHtml, "utf8");
    },
  };
}
