export interface DemoMenuItem {
  globals: {
    component: string;
    connector: string;
  };
  name: string;
  children?: DemoMenuItem[];
}
