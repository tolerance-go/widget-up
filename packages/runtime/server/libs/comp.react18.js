!(function (e, t) {
    "object" == typeof exports && "undefined" != typeof module
      ? t(exports, require("react"))
      : "function" == typeof define && define.amd
      ? define(["exports", "react"], t)
      : t(
          ((e =
            "undefined" != typeof globalThis
              ? globalThis
              : e || self).Component_react18 = {}),
          e.React
        );
  })(this, function (e, t) {
    "use strict";
    var n = function () {
      var e = t.useState("red"),
        n = e[0],
        o = e[1];
      return t.createElement(
        "button",
        {
          style: { color: n },
          onClick: function () {
            o(function (e) {
              return "red" === e ? "blue" : "red";
            });
          },
        },
        "hi button"
      );
    };
    (e.Component = n),
      (e.default = n),
      Object.defineProperty(e, "__esModule", { value: !0 });
  });
  