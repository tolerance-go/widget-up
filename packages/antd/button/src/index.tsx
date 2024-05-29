import React from "react";
import { useState } from "react";
import { Button as AntdButton } from "antd";

const Button = () => {
  const [color, setColor] = useState("red");
  return (
    <span className="antd_v3_26_20">
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
    </span>
  );
};

export default Button;
