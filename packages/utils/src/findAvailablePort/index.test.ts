import { jest } from "@jest/globals";
import type { Server } from "net";
import { findAvailablePort } from ".";

describe("测试端口查找功能", () => {
  let mockedNet: typeof import("net");

  beforeEach(async () => {
    jest.unstable_mockModule("net", () => ({
      createServer: jest.fn(),
    }));

    mockedNet = await import("net");
  });

  it("应正确处理端口被占用的情况，并找到可用端口", async () => {
    jest.spyOn(mockedNet, "createServer").mockImplementation(
      (): Server =>
        ({
          listen: jest.fn(
            (port, callback: () => void) => port === 3001 && callback()
          ),
          on: jest.fn(
            (
              event: string,
              handler: (arg: { code?: string; message?: string }) => void
            ) => {
              if (event === "error") {
                handler({ code: "EADDRINUSE" });
              }
            }
          ),
          close: jest.fn(),
          once: jest.fn(),
        } as unknown as Server)
    );

    const availablePort = await findAvailablePort(3000, mockedNet);
    expect(availablePort).toBe(3001);
  });

  it("应当在遇到非端口占用错误时拒绝 Promise", async () => {
    jest.spyOn(mockedNet, "createServer").mockImplementation(
      (): Server =>
        ({
          listen: jest.fn((port, callback: () => void) => callback()),
          on: jest.fn(
            (event: string, handler: (arg: { message: string }) => void) => {
              if (event === "error") {
                handler({ message: "Generic error" });
              }
            }
          ),
          close: jest.fn(),
          once: jest.fn(),
        } as unknown as Server)
    );

    await expect(findAvailablePort(3000, mockedNet)).rejects.toEqual({
      message: "Generic error",
    });
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore all mocks to their original implementations
  });
});
