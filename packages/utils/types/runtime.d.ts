export interface MenuItem {
  globals: {
    component: string;
    register: string;
  };
  name: string;
  children?: MenuItem[];
}
