export class IdentifierManager {
  public rightPanelId: string;
  public leftPanelId: string;

  private static instance: IdentifierManager;

  // 私有构造函数防止外部实例化
  private constructor() {
    this.rightPanelId = "rightPanel";
    this.leftPanelId = "leftPanel";
  }

  // 静态方法用于获取唯一实例
  public static getInstance(): IdentifierManager {
    if (!IdentifierManager.instance) {
      IdentifierManager.instance = new IdentifierManager();
    }
    return IdentifierManager.instance;
  }
}

export const identifierManager = IdentifierManager.getInstance();
