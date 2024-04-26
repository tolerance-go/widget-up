import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import { Plugin } from "rollup";
import { findAvailablePort } from "./findAvailablePort";
import path from "path";
import fs from "fs-extra";
import ejs from "ejs";
import { logger } from "./logger";

export default async function serveRenderLivereload({
  port = 3000,
  indexHtmlPath = path.join(process.cwd(), "index.html"),
  renderOptions,
}: {
  port?: number;
  indexHtmlPath?: string;
  renderOptions?: object;
} = {}): Promise<Plugin> {
  const availablePort = await findAvailablePort(port);

  logger.info(`indexHtmlPath: ${indexHtmlPath}`);

  return {
    name: "rollup-plugin-serve-render-livereload",
    buildStart() {
      // 检查是否在生产环境中，如果是，则不启用这两个插件
      if (process.env.NODE_ENV === "production") {
        this.error(
          "Serve and Livereload plugins are not intended for production use."
        );
      }
    },
    generateBundle() {
      const distPath = path.resolve("dist");
      const serverPath = path.join(distPath, "server");

      fs.emptyDirSync(distPath);
      fs.emptyDirSync(serverPath);

      ejs.renderFile(
        indexHtmlPath,
        {
          ...renderOptions,
        },
        (err, html) => {
          if (err) {
            console.error("Error rendering EJS template:", err);
            return;
          }
          // 写入生成的 HTML 到目标目录
          fs.writeFileSync(path.join(serverPath, "index.html"), html, "utf8");
        }
      );
    },
    options(inputOptions) {
      // 确保inputOptions.plugins是一个数组
      if (!Array.isArray(inputOptions.plugins)) {
        inputOptions.plugins = [];
      }

      // 添加serve和livereload插件到数组中
      inputOptions.plugins.push(
        serve({
          open: true, // 自动打开浏览器
          contentBase: ["dist/umd", "dist/server"],
          host: "localhost",
          port: availablePort,
        }),
        livereload({
          watch: ["dist/umd", "dist/server"],
        })
      );
    },
  };
}
