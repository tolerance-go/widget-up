import { stripUMDWrapper } from "./stripUMDWrapper";

type UMDMeta = {
  exportGlobal: string | null;
  importGlobals: string[];
};

export function parseUMDMeta({
  scriptContent,
}: {
  scriptContent: string;
}): UMDMeta {
  // 定义具有索引签名的对象类型
  type GlobalObject = Record<string, any>;

  // 创建假的全局对象和模块环境，使用Proxy来追踪依赖
  const dependencies: string[] = [];
  let exportGlobal: string | null = null; // 用于存储被导出的全局变量名
  const fakeGlobal: GlobalObject = new Proxy<GlobalObject>(
    {},
    {
      get: function (target, prop: string) {
        // 确保只处理字符串类型的属性
        if (typeof prop === "string") {
          dependencies.push(prop);
        }
        return target[prop];
      },
      set: function (target, prop: string, value: any) {
        if (typeof prop === "string") {
          target[prop] = value;
          // 如果这是第一次赋值，我们假定它是主要的导出变量
          if (exportGlobal === null) exportGlobal = prop;
        }
        return true; // 必须返回true表示成功设置了值
      },
    }
  );

  // 工厂函数，处理依赖注入
  const factory = function () {};

  // 准备执行UMD脚本
  try {
    const exports = undefined;
    const module = undefined;
    const define = undefined;
    const self = undefined;
    const globalThis = undefined;

    const wrapper = stripUMDWrapper({ scriptContent });

    console.log("wrapper", wrapper);

    eval(`
    ${wrapper} 
    wrap(fakeGlobal, factory);
    `);
  } catch (error) {
    console.error("Error executing the UMD script:", error);
    return { exportGlobal: null, importGlobals: [] }; // 出错时返回空结果
  }

  // 清除重复的依赖项
  const uniqueDependencies = [...new Set(dependencies)];

  return {
    exportGlobal,
    importGlobals: uniqueDependencies,
  };
}
