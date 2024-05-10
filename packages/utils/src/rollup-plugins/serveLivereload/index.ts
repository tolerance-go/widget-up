import { findAvailablePort } from "@/src/findAvailablePort";
import connectLivereload from "connect-livereload";
import express from "express";
import { Server as HttpServer } from "http";
import livereload from "livereload";
import open from "open";
import path from "path";
import { Plugin } from "rollup";
import { logger } from "./logger";

interface ServeLivereloadOptions {
  contentBase: string | string[]; // contentBase 现在可以是一个字符串或字符串数组
  port?: number;
  livereloadPort?: number;
  openBrowser?: boolean; // 控制是否在服务器启动时自动打开浏览器
}

const serveLivereload = async (
  options: ServeLivereloadOptions
): Promise<Plugin> => {
  const {
    contentBase,
    port = 3000,
    livereloadPort = 35729,
    openBrowser = true,
  } = options;

  const livereloadPortAvailable = await findAvailablePort(livereloadPort);

  // 支持 contentBase 是数组或字符串的情况
  const contentBasePaths = Array.isArray(contentBase)
    ? contentBase.map((base) => path.resolve(base))
    : [path.resolve(contentBase)];

  let liveReloadServer = livereload.createServer({
    port: livereloadPortAvailable,
  });
  contentBasePaths.forEach((path) => liveReloadServer.watch(path));

  const app = express();
  app.use(connectLivereload({ port: livereloadPort }));

  // 为每个 contentBasePath 设置静态资源服务
  contentBasePaths.forEach((basePath) => {
    app.use(express.static(basePath));
  });

  let server: HttpServer | null = null;

  return {
    name: "serve-livereload",
    async buildStart() {
      logger.info(`Serving content from: ${contentBasePaths.join(", ")}`);

      if (server) return;
      const actualPort = await findAvailablePort(port);
      server = app.listen(actualPort, () => {
        const url = `http://localhost:${actualPort}`;
        console.log(`Server listening on ${url}`);

        if (openBrowser) {
          open(url).catch((err) =>
            logger.error(`Failed to open browser: ${err}`)
          );
        }
      });
    },
  };
};

export default serveLivereload;
