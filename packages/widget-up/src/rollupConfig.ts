import fs from 'fs';
import path from 'path';
import { RollupOptions } from 'rollup';

import { fileURLToPath } from 'url';
import { PackageJson } from 'widget-up-utils';
import { isDev } from './env';
import { generateDevInputFile } from './generateDevInputFile';
import { generateGlobals } from './generateGlobals';
import { generateOutputs } from './generateOutputs';
import { getConfig } from './getConfig';
import { getDevInput } from './getDevInput';
import { getPlugins } from './getPlugins';
import { MenuItem } from './getPlugins/runtimeHtmlPlugin';
import { getProdInput } from './getProdInput';
import { logger } from './logger';
import { parseDirectoryStructure } from './parseDirectoryStructure';
import { convertDirectoryToMenu } from './utils/convertDirectoryToMenu';

const NODE_ENV = process.env.NODE_ENV;

logger.info(`${'='.repeat(10)} ${NODE_ENV} ${'='.repeat(10)}`);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rootPath = path.join(__dirname, '..');

const cwdPath = process.cwd();

logger.info(`rootPath is ${rootPath}`);
logger.info(`cwdPath is ${cwdPath}`);

const demosPath = path.join(cwdPath, 'demos');
logger.info(`demosPath is ${demosPath}`);

let demoMenus: MenuItem[];

if (fs.existsSync(demosPath)) {
  logger.log('start demos mode');
  const demosDirFileData = parseDirectoryStructure(demosPath);
  logger.info(`demosDirFileData: ${JSON.stringify(demosDirFileData, null, 2)}`);

  demoMenus = convertDirectoryToMenu(demosDirFileData.children ?? []);
}

const packageConfig = JSON.parse(
  fs.readFileSync(path.resolve('package.json'), 'utf8'),
) as PackageJson;

const config = getConfig();

const globals = generateGlobals(config);

const outputs = generateOutputs(config, globals);

const rollupConfig: RollupOptions[] = outputs.map((output) => ({
  input: getProdInput(packageConfig),
  output,
  plugins: getPlugins({
    rootPath,
    config,
    packageConfig,
    globals,
    output,
    menus: demoMenus,
  }),
}));

export default rollupConfig;
