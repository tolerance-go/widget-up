import DevGlobalApp from 'DevGlobalApp';
const rootElement = document.getElementById("root");
const appElement = DevGlobalApp({ initialData: undefined });

rootElement?.appendChild(appElement);
