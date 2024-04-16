import React from "react";
import { useState } from "react";
import "./index.css";

const Button = () => {
  const [color, setColor] = useState("red");
  return (
    <button
      className="react16_css button"
      style={{
        color,
      }}
      onClick={() => {
        setColor((prev) => (prev === "red" ? "blue" : "red"));
      }}
    >
      hi button
    </button>
  );
};

export default Button;
