import { ResolvedNpmResult, resolveNpmInfo } from "../utils/resolveNpmInfo";

interface InputNpmManagerOptions {
  cwd: string;
}

export class InputNpmManager {
  private cache: Map<string, ResolvedNpmResult>;
  private cwd: string;

  constructor(options: InputNpmManagerOptions) {
    this.cwd = options.cwd;
    this.cache = new Map<string, ResolvedNpmResult>();
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

export default function getInputNpmManager(
  options: InputNpmManagerOptions
): InputNpmManager {
  return new InputNpmManager(options);
}
