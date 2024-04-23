import path from 'path';
import { Logger } from './utils/Logger';

export const logger = new Logger(
  path.join(process.cwd(), '.logs', new Date().toISOString().substring(0, 10)),
);
