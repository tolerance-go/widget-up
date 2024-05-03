!(function (e, o) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = o(
        require("react"),
        require("react-dom"),
        require("@widget-up-demo/react16")
      ))
    : "function" == typeof define && define.amd
    ? define(["react", "react-dom", "@widget-up-demo/react16"], o)
    : ((e =
        "undefined" != typeof globalThis
          ? globalThis
          : e || self).RegisterRender_react16 = o(
        e.React,
        e.ReactDOM,
        e.RuntimeComponent
      ));
})(this, function (e, o, n) {
  "use strict";
  return function (t) {
    var r = t.rootElement;
    r
      ? (o.unmountComponentAtNode(r)
          ? console.log("Component unmounted successfully.")
          : console.log(
              "No component was mounted on rootElement, or unmount was unsuccessful."
            ),
        o.render(e.createElement(n.Component, null), r))
      : console.error("Root element not found.");
  };
});
