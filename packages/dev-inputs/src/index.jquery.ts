import DevGlobalApp from 'widget-up-runtime';
const rootElement = document.getElementById("root");
const appElement = DevGlobalApp({ initialData: undefined });

rootElement?.appendChild(appElement);
