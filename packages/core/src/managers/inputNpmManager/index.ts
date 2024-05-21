import { detectTechStack } from "@/src/utils/detectTechStack";
import { PathManager } from "../pathManager";
import {
  ResolvedNpmResult,
  getConnectorModuleName,
  resolveNpmInfo,
} from "widget-up-utils";

interface InputNpmManagerOptions {
  cwd: string;
}

export class InputNpmManager {
  private static instance: InputNpmManager | null;
  private cache: Map<string, ResolvedNpmResult>;
  private cwd: string;

  public static getInstance(): InputNpmManager {
    if (!InputNpmManager.instance) {
      const pathManager = PathManager.getInstance();
      InputNpmManager.instance = new InputNpmManager({
        cwd: pathManager.modulePath,
      });
    }
    return InputNpmManager.instance;
  }

  constructor(options: InputNpmManagerOptions) {
    this.cwd = options.cwd;
    this.cache = new Map<string, ResolvedNpmResult>();
  }

  public getCurrentInput() {
    const stack = detectTechStack();
    return this.getInputByName(
      getConnectorModuleName(stack.name, stack.version.exact)
    );
  }

  // 根据名称获取入口包信息
  public getInputByName(name: string): ResolvedNpmResult {
    // 检查是否已缓存
    if (this.cache.has(name)) {
      return this.cache.get(name)!;
    }

    try {
      // 使用 resolveNpmInfo 函数获取信息
      const npmInfo = resolveNpmInfo({ name, cwd: this.cwd });
      // 将获取的信息缓存
      this.cache.set(name, npmInfo);
      return npmInfo;
    } catch (error) {
      if (error instanceof Error) {
        // 处理未找到模块的错误
        throw new Error(`Unable to resolve NPM input: ${error.message}`);
      } else {
        throw new Error("Unable to resolve NPM input");
      }
    }
  }
}
