import React from "react";
import ReactDOM from "react-dom";
import { Component } from "@widget-up-demo/react16";

const registerRender = ({ rootElement }: { rootElement: HTMLElement }) => {
  // 确认 rootElement 存在
  if (!rootElement) {
    console.error("Root element not found.");
    return;
  }

  // 尝试卸载 rootElement 上现有的 React 组件
  if (ReactDOM.unmountComponentAtNode(rootElement)) {
    console.log("Component unmounted successfully.");
  } else {
    console.log(
      "No component was mounted on rootElement, or unmount was unsuccessful."
    );
  }

  ReactDOM.render(<Component />, rootElement);
};

export default registerRender;
