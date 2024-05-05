function createWindow(baseWindow: Window): Window {
  const localProperties = new Map<string, any>();

  return new Proxy(baseWindow, {
    get(target, property, receiver) {
      if (localProperties.has(property.toString())) {
        return localProperties.get(property.toString());
      }
      const value = target[property as keyof Window];
      if (typeof value === "function") {
        return value.bind(target); // 绑定函数到原始的 window 对象
      }
      return value;
    },
    set(target, property, value) {
      localProperties.set(property.toString(), value);
      return true;
    },
    has(target, property) {
      return localProperties.has(property.toString()) || property in target;
    },
    deleteProperty(target, property) {
      return localProperties.delete(property.toString());
    },
  });
}

export { createWindow };
