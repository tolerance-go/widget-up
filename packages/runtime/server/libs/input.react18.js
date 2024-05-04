!(function (e, o) {
  "object" == typeof exports && "undefined" != typeof module
    ? o(
        exports,
        require("react"),
        require("react-dom/client"),
        require("@widget-up-demo/react18")
      )
    : "function" == typeof define && define.amd
    ? define(
        ["exports", "react", "react-dom/client", "@widget-up-demo/react18"],
        o
      )
    : o(
        ((e =
          "undefined" != typeof globalThis
            ? globalThis
            : e || self).Register_react18 = {}),
        e.React,
        e.ReactDOM,
        e.RuntimeComponent
      );
})(this, function (e, o, n, t) {
  "use strict";
  var u = null;
  (e.render = function (e) {
    var r = e.rootElement;
    r
      ? (u = n.createRoot(r)).render(o.createElement(t.Component, null))
      : console.error("Root element not found.");
  }),
    (e.unmount = function () {
      u
        ? (u.unmount(), console.log("Component unmounted successfully."))
        : console.log("No component was mounted, or unmount was unsuccessful.");
    });
});
