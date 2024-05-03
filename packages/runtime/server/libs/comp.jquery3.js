!(function (e, o) {
  "object" == typeof exports && "undefined" != typeof module
    ? o(exports, require("jquery"))
    : "function" == typeof define && define.amd
    ? define(["exports", "jquery"], o)
    : o(
        ((e =
          "undefined" != typeof globalThis
            ? globalThis
            : e || self).Component_jquery3 = {}),
        e.$
      );
})(this, function (e, o) {
  "use strict";
  var t = function () {
    var e = o("<button>Hi Button</button>").css({ color: "red" });
    return (
      e.on("click", function () {
        "rgb(255, 0, 0)" === e.css("color")
          ? e.css("color", "blue")
          : e.css("color", "red");
      }),
      e
    );
  };
  (e.Component = t),
    (e.default = t),
    Object.defineProperty(e, "__esModule", { value: !0 });
});
