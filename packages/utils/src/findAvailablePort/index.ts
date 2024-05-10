import nodeNet from "node:net";

/**
 * 检查指定的端口是否被占用，如果被占用，尝试找到最接近的未被占用的端口。
 * @param port 要检查的初始端口号。
 * @returns 返回一个未被占用的端口号。
 */
export function findAvailablePort(
  port: number,
  net: typeof import("net") = nodeNet
): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.listen(port, () => {
      // 注册一个一次性监听器，用于在服务器关闭时触发
      server.once("close", () => {
        // 当服务器关闭成功后，解析 Promise 并返回当前尝试的端口号
        resolve(port);
      });

      // 主动关闭服务器，这通常用于测试端口是否能够成功开启而不实际进行长时间监听
      server.close();
    });

    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        // 端口已被占用
        console.log(`Port ${port} is in use, checking port ${port + 1}`);
        resolve(findAvailablePort(port + 1));
      } else {
        reject(err);
      }
    });
  });
}
