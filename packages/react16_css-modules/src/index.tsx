import React from "react";
import { useState } from "react";
import styles from "./index.css";

const Button = () => {
  const [color, setColor] = useState("red");
  return (
    <button
      className={styles.button}
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
