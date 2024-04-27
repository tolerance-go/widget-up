// html-render.js
import ejs from "ejs";
import fs from "fs";
import path from "path";
import chokidar from "chokidar";

export default function htmlRender(options: { src: string; dest: string }) {
  const { src, dest } = options;
  const templatePath = path.resolve(process.cwd(), src);
  const outputPath = path.resolve(process.cwd(), dest, "index.html");
  const outputDir = path.dirname(outputPath);

  // 渲染并写入 HTML
  function renderAndWrite() {
    const template = fs.readFileSync(templatePath, "utf-8");
    const renderedHtml = ejs.render(template, {});
    fs.writeFileSync(outputPath, renderedHtml);
  }

  // 使用 chokidar 监听文件变化
  const watcher = chokidar.watch(templatePath, {
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on("change", () => {
    console.log(`File ${src} has been changed, re-rendering HTML.`);
    renderAndWrite();
  });

  // 插件对象
  return {
    name: "html-render",
    buildStart() {
      // 确保目标目录存在
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // 初始化时渲染并写入 HTML
      renderAndWrite();
    },
    // 其他 Rollup 插件钩子...
  };
}
