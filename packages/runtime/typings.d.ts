export {};

declare global {
  interface Window {
    RuntimeComponent: {
      Component: any; // You can replace 'any' with a more specific type if known
    };
  }
}
