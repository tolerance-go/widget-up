import { JQueryComponent } from "widget-up-runtime";
const rootElement = document.getElementById("root");
const appElement = JQueryComponent({ initialData: undefined });

rootElement?.appendChild(appElement);
