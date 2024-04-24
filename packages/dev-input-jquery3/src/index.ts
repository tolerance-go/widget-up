import { JQueryComponent, globalEventBus } from "widget-up-runtime";

const rootElement = document.getElementById("root");

globalEventBus.on("onClickMenuItem", () => {
  if (!rootElement) return;

  // 首先清空 rootElement
  rootElement.innerHTML = "";

  // 然后创建并添加新的 JQueryComponent
  const appElement = JQueryComponent({ initialData: undefined });
  rootElement.appendChild(appElement[0]);
});
