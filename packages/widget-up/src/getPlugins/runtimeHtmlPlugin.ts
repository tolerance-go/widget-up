import ejs from "ejs";
import fs from "fs-extra";
import path from "path";
import { GlobalsSchemaConfig, PackageJson, ParseConfig } from "widget-up-utils";
import { compileLessToCSS } from "../utils/compileLessToCSS";

export interface MenuItem {
  name: string;
  children?: MenuItem[];
}

export function runtimeHtmlPlugin({
  globals,
  src,
  dest,
  packageConfig,
  config,
  rootPath,
  menus,
  inlineStyles,
  externalStylesheets = [],
}: {
  rootPath: string;
  config: ParseConfig;
  packageConfig: PackageJson;
  globals?: GlobalsSchemaConfig;
  dest: string;
  src: string;
  menus?: MenuItem[];
  inlineStyles?: string;
  externalStylesheets?: string[];
}) {
  return {
    name: "custom-html", // 插件名称
    generateBundle: async () => {
      const stylesPath = path.join(rootPath, "styles");
      const devFrameStylePath = path.join(stylesPath, "index.less");
      const cssStr = await compileLessToCSS(devFrameStylePath, rootPath);

      const dist = path.resolve(dest);
      fs.ensureDirSync(dist);
      // 写入生成的 HTML 到目标目录
      fs.writeFileSync(path.join(dist, "index.css"), cssStr, "utf8");

      // 读取 EJS 模板文件
      const templatePath = path.join(rootPath, src);
      ejs.renderFile(
        templatePath,
        {
          scriptTags:
            globals &&
            packageConfig.peerDependencies &&
            config.umd?.external &&
            config.umd?.globals
              ? Object.entries(globals).map(([pkgName, value]) => {
                  return {
                    src: `https://unpkg.com/${pkgName}@${
                      packageConfig.peerDependencies![pkgName]
                    }${config.umd!.external?.[pkgName]?.unpkg.filePath}`,
                    global: `window.${globals[pkgName]} = ${
                      config.umd!.globals[pkgName]
                    };`,
                  };
                })
              : [],
          bundleSrc: "./umd/index.js",
          includeCSS: !!config.css,
          menus,
          inlineStyles,
          externalStylesheets,
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
        },
      );
    },
  };
}
