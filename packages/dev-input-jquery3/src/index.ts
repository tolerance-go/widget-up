import { HTMLComponent, globalEventBus } from "widget-up-runtime";




const rootElement = document.getElementById("root");
const appElement = HTMLComponent({ initialData: undefined });

rootElement?.appendChild(appElement);


globalEventBus.on('onClickMenuItem', () => {

})
