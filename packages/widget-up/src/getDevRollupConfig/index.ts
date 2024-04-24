import path from 'path';
import { RollupOptions } from 'rollup';
import { isDev } from '../env';
import del from 'rollup-plugin-delete';

export const getDevRollupConfig = ({
  rootPath,
}: {
  rootPath: string;
}): RollupOptions => {
  return {
    input: path.join(rootPath, 'src/devInputs/index.jquery.ts'),
    output: {
      file: 'dist/server/index.js',
      format: 'iife',
      sourcemap: isDev ? 'inline' : false,
    },
    plugins: [del({ targets: 'dist/server/*' })],
  };
};
