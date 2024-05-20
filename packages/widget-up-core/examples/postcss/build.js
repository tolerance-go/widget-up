import { rollup } from 'rollup';
import config from './rollup.config.js';

async function build() {
  const bundle = await rollup(config);
  const { output } = await bundle.generate(config.output);

  // 打印所有chunk的信息和依赖关系
  for (const chunk of output) {
    if (chunk.type === 'chunk') {
      console.log(`Chunk: ${chunk.name}`);
      console.log('Dependencies:');
      
      for (const dep of chunk.imports) {
        console.log(dep); // 打印每个模块及其路径
      }
    //   for (const dep of Object.keys(chunk.modules)) {
    //     console.log(dep); // 打印每个模块及其路径
    //   }
    }
  }

  await bundle.close();
}

build().catch(error => console.error("Build failed:", error));
