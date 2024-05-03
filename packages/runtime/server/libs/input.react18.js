!(function (e, n) {
    "object" == typeof exports && "undefined" != typeof module
      ? n(exports, require("react"), require("react-dom/client"))
      : "function" == typeof define && define.amd
      ? define(["exports", "react", "react-dom/client"], n)
      : n(
          ((e =
            "undefined" != typeof globalThis
              ? globalThis
              : e || self).Register_react18 = {}),
          e.React,
          e.ReactDOM
        );
  })(this, function (e, n, t) {
    "use strict";
    var o = function () {
        var e = n.useState("red"),
          t = e[0],
          o = e[1];
        return n.createElement(
          "button",
          {
            style: { color: t },
            onClick: function () {
              o(function (e) {
                return "red" === e ? "blue" : "red";
              });
            },
          },
          "hi button"
        );
      },
      r = null;
    (e.render = function (e) {
      var u = e.rootElement;
      u
        ? (r = t.createRoot(u)).render(n.createElement(o, null))
        : console.error("Root element not found.");
    }),
      (e.unmount = function () {
        r
          ? (r.unmount(), console.log("Component unmounted successfully."))
          : console.log("No component was mounted, or unmount was unsuccessful.");
      });
  });
  