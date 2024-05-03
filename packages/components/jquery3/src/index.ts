import $ from "jquery";

const Button = () => {
  const $button = $("<button>Hi Button</button>").css({ color: "red" });

  $button.on("click", function () {
    const color = $button.css("color");
    if (color === "rgb(255, 0, 0)") {
      $button.css("color", "blue");
    } else {
      $button.css("color", "red");
    }
  });

  return $button;
};

export default Button;
export { Button as Component };
