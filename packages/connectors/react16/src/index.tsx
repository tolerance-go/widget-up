import { ReactElement } from "react";
import ReactDOM from "react-dom";

const render = ({
  rootElement,
  component,
}: {
  rootElement: HTMLElement;
  component: ReactElement;
}) => {
  // 确认 rootElement 存在
  if (!rootElement) {
    console.error("Root element not found.");
    return;
  }

  ReactDOM.render(component, rootElement);
};

const unmount = ({ rootElement }: { rootElement: HTMLElement }) => {
  // 尝试卸载 rootElement 上现有的 React 组件
  if (ReactDOM.unmountComponentAtNode(rootElement)) {
    console.log("Component unmounted successfully.");
  } else {
    console.log(
      "No component was mounted on rootElement, or unmount was unsuccessful."
    );
  }
};

export { render, unmount };
