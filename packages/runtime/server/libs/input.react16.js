!(function (e, n, o, t) {
  "use strict";
  t.registerRender(function (t) {
    var u = t.rootElement;
    u
      ? (n.unmountComponentAtNode(u)
          ? console.log("Component unmounted successfully.")
          : console.log(
              "No component was mounted on rootElement, or unmount was unsuccessful."
            ),
        n.render(e.createElement(o.Component, null), u))
      : console.error("Root element not found.");
  });
})(React, ReactDOM, RuntimeComponent, WidgetUpRuntime);
