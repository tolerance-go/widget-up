import { logger } from "./logger";

function createWindow(baseWindow: Window): Window {
  const localProperties = new Map<string | symbol, any>();

  return new Proxy(baseWindow, {
    get(target, property, receiver) {
      logger.log("get target", {
        target,
        property,
      });
      if (localProperties.has(property)) {
        return localProperties.get(property);
      }
      const value = target[property as keyof Window];

      if (typeof value === "function") {
        logger.log("value is function");

        if (property === "Symbol") {
          return value;
        }

        return value.bind(target);
      }
      return value;
    },
    set(target, property, value) {
      localProperties.set(property, value);
      return true;
    },
    has(target, property) {
      return localProperties.has(property) || property in target;
    },
    deleteProperty(target, property) {
      return localProperties.delete(property);
    },
  });
}

export { createWindow };
