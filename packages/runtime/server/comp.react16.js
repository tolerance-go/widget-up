!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t(require("react")))
    : "function" == typeof define && define.amd
    ? define(["react"], t)
    : ((e =
        "undefined" != typeof globalThis ? globalThis : e || self).MyComponent =
        t(e.React));
})(this, function (e) {
  "use strict";
  return function () {
    var t = e.useState("red"),
      n = t[0],
      o = t[1];
    return e.createElement(
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
});
