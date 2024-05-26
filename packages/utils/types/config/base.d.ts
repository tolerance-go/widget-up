export type CSSModuleType = {
  modules: boolean; // 是否启用 CSS 模块化
  autoModules?: boolean; // 是否自动启用模块化
  useTailwind?: boolean; // 是否启用 Tailwind CSS
  tailwindConfigPath?: string; // 可选的 Tailwind CSS 配置文件路径
};

export type StyleEntry = {
  development: string;
  production: string;
};

export type BrowserEntry = {
  development: string;
  production: string;
};
