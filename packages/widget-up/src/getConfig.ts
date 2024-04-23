import fs from 'fs';
import path from 'path';

import { parseConfig } from 'widget-up-utils';

// 读取和解析 YAML 配置文件
export function getConfig() {
  const configPath = path.join(process.cwd(), './widget-up.json');
  const fileContents = fs.readFileSync(configPath, 'utf8');
  return parseConfig(JSON.parse(fileContents));
}
