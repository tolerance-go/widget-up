!(function (e, o) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = o(require("jquery")))
    : "function" == typeof define && define.amd
    ? define(["jquery"], o)
    : ((e =
        "undefined" != typeof globalThis
          ? globalThis
          : e || self).JQuery3_Component = o(e.$));
})(this, function (e) {
  "use strict";
  return function () {
    var o = e("<button>Hi Button</button>").css({ color: "red" });
    return (
      o.on("click", function () {
        "rgb(255, 0, 0)" === o.css("color")
          ? o.css("color", "blue")
          : o.css("color", "red");
      }),
      o
    );
  };
});
