import React, { useEffect } from "react";
import { useState } from "react";
import { Button as AntdButton } from "antd";
import { formSettings } from "widget-up-lib";

const Button = ({ settings }: { settings?: Record<string, any> }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    return formSettings.on("text:changed", ({ value }) => {
      setText(value);
    });
  }, []);

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
