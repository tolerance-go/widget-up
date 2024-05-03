!(function (e, n) {
  "use strict";
  n.registerRender(function (n) {
    var t = n.rootElement;
    if (t) {
      t.innerHTML = "";
      var o = e.Component().get(0);
      o && t.appendChild(o);
    } else console.error("Root element not found.");
  });
})(RuntimeComponent, WidgetUpRuntime);
