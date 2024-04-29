export const isExactVersion = (versionRange: string): boolean => {
  // 精确版本号通常是 "x.y.z" 的格式，不包含任何范围指定符号如 ^, ~, >, < 等
  return /^\d+\.\d+\.\d+$/.test(versionRange);
};
