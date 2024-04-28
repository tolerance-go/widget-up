import { Plugin } from "rollup";
import express from "express";
import livereload from "livereload";
import connectLivereload from "connect-livereload";
import { Server as HttpServer } from "http";
import path from "path";
import { logger } from "./logger";
import { findAvailablePort } from "./findAvailablePort";
import open from "open";

interface ServeLivereloadOptions {
  contentBase: string;
  port: number;
  livereloadPort?: number;
  openBrowser?: boolean; // 控制是否在服务器启动时自动打开浏览器
}

const serveLivereload = (options: ServeLivereloadOptions): Plugin => {
  const {
    contentBase,
    port = 3000,
    livereloadPort = 35729,
    openBrowser = true,
  } = options; // 默认 livereload 端口是 35729

  const contentBasePath = path.resolve(contentBase);

  let liveReloadServer = livereload.createServer({ port: livereloadPort });
  liveReloadServer.watch(contentBasePath);

  const app = express();
  app.use(connectLivereload({ port: livereloadPort }));
  app.use(express.static(contentBasePath));
  let server: HttpServer | null = null;

  return {
    name: "serve-livereload",
    async buildStart() {
      logger.info(`contentBasePath: ${contentBasePath}`);

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
