import React from "react";
import { useState } from "react";
import { Button as AntdButton } from "antd";

const Button = () => {
  const [color, setColor] = useState("red");
  return (
    <AntdButton
      style={{
        color,
      }}
      onClick={() => {
        setColor((prev) => (prev === "red" ? "blue" : "red"));
      }}
    >
      hi button
    </AntdButton>
  ); 
};

export default Button;
