!(function (e, o) {
  "object" == typeof exports && "undefined" != typeof module
    ? o(
        exports,
        require("react"),
        require("react-dom"),
        require("@widget-up-demo/react16")
      )
    : "function" == typeof define && define.amd
    ? define(["exports", "react", "react-dom", "@widget-up-demo/react16"], o)
    : o(
        ((e =
          "undefined" != typeof globalThis
            ? globalThis
            : e || self).Register_react16 = {}),
        e.React,
        e.ReactDOM,
        e.RuntimeComponent
      );
})(this, function (e, o, t, n) {
  "use strict";
  (e.render = function (e) {
    var r = e.rootElement;
    r
      ? t.render(o.createElement(n.Component, null), r)
      : console.error("Root element not found.");
  }),
    (e.unmount = function (e) {
      var o = e.rootElement;
      t.unmountComponentAtNode(o)
        ? console.log("Component unmounted successfully.")
        : console.log(
            "No component was mounted on rootElement, or unmount was unsuccessful."
          );
    });
});
