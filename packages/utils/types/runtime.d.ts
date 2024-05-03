export interface MenuItem {
  globals: {
    component: string;
    registerRender: string;
  };
  name: string;
  children?: MenuItem[];
}
