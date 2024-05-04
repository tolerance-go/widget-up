import React from "react";
import { useState } from "react";

const Button = () => {
  const [color, setColor] = useState("red");
  return (
    <button
      style={{
        color,
      }}
      onClick={() => {
        setColor((prev) => (prev === "red" ? "blue" : "red"));
      }}
    >
      hi button react18
    </button>
  );
};

export default Button;
export { Button as Component };
