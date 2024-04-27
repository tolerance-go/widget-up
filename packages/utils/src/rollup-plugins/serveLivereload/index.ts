import { Plugin } from "rollup";
import express from "express";
import livereload from "livereload";
import connectLivereload from "connect-livereload";
import { Server as HttpServer } from "http";
import path from "path";
import { logger } from "./logger";
import { findAvailablePort } from "./findAvailablePort";

interface ServeLivereloadOptions {
  contentBase: string;
  port: number;
  livereloadPort?: number;
}

const serveLivereload = (options: ServeLivereloadOptions): Plugin => {
  const { contentBase, port = 3000, livereloadPort = 35729 } = options; // 默认 livereload 端口是 35729

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

      server = app.listen(await findAvailablePort(port), () => {
        console.log(`Server listening on http://localhost:${port}`);
      });
    },
  };
};

export default serveLivereload;
