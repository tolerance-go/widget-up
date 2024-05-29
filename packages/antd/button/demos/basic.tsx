import React from "react";
import Button from "@widget-up-antd/button";

const BasicDemo = ({ settings }: { settings?: Record<string, any> }) => {
  return <Button settings={settings}></Button>;
};

export default BasicDemo;
export { BasicDemo as Component };
