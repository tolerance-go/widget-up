import { Plugin } from "rollup";
import rollup, { RollupOptions, OutputOptions } from "rollup";

// 定义插件接受的参数类型
interface RuntimeRollupOptions extends RollupOptions {
  output: OutputOptions; // 确保输出配置被正确传递
}

// 主插件函数
function runtimeRollup(options: RuntimeRollupOptions): Plugin {
  return {
    name: "runtime-rollup",

    // 使用异步的构建开始钩子
    async buildStart() {
      const { output, ...rollupOptions } = options;

      try {
        // 创建一个新的 Rollup 实例
        const bundle = await rollup.rollup(rollupOptions);

        // 根据配置输出文件
        await bundle.write(output);

        // 或者使用 generate 如果你不想直接写文件
        // const { output: generatedOutput } = await bundle.generate(output);
        // 处理 generatedOutput 逻辑，例如打印或进一步操作
      } catch (error: unknown) {
        if (error instanceof Error) {
          // 错误处理
          this.error("Rollup build failed: " + error.message);
        }
      }
    },
  };
}

export default runtimeRollup;
