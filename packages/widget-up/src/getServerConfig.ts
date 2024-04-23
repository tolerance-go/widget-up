import serve from "rollup-plugin-serve";
import { findAvailablePort } from "./findAvailablePort";

// Usage in Rollup config
const PORT = 3000;

export const getServerConfig = async () => {
  const availablePort = await findAvailablePort(PORT);
  return serve({
    open: true, // 自动打开浏览器
    contentBase: ["dist"], // 服务器根目录，'.': 配置文件同级
    historyApiFallback: true, // SPA页面可使用
    host: "localhost",
    port: availablePort,
  });
};
