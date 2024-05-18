
export class PathManager {
  public assetsUrl: string;
  public menusDataUrl: string;
  public formSchemaUrl: string;

  private static instance: PathManager;

  // 私有构造函数防止外部实例化
  private constructor() {
    this.assetsUrl = "/assets";
    this.menusDataUrl = `${this.assetsUrl}/menus.json`;
    this.formSchemaUrl = `${this.assetsUrl}/formSchema.json`;
  }

  // 静态方法用于获取唯一实例
  public static getInstance(): PathManager {
    if (!PathManager.instance) {
      PathManager.instance = new PathManager();
    }
    return PathManager.instance;
  }
}

export const pathManager = PathManager.getInstance();
