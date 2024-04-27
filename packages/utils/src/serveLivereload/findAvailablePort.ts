import net from "net";

/**
 * 检查指定端口是否可用
 * @param {number} port 要检查的端口号
 * @returns {Promise<number>} 如果端口可用，返回Promise解析为该端口号
 */
function checkPort(port: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();

    server.on("error", (err) => {
      console.log(`Error on port ${port}: ${err.message}`);
      server.close();
      reject(err);
    });

    server.listen(port, () => {
      console.log(`Port ${port} is available. Now closing...`);
      server.close(() => resolve(port));
    });
  });
}

export async function findAvailablePort(startPort: number) {
  try {
    return await checkPort(startPort);
  } catch (err) {
    console.log(`Port ${startPort} is not available. Trying next port.`);
    return findAvailablePort(startPort + 1);
  }
}
