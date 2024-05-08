export interface DemoMenuItem {
  globals: {
    component: string;
    register: string;
  };
  name: string;
  children?: DemoMenuItem[];
}
