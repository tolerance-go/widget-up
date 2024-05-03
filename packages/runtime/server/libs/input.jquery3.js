!(function (e, n) {
  "object" == typeof exports && "undefined" != typeof module
    ? n(exports, require("@widget-up-demo/jquery3"))
    : "function" == typeof define && define.amd
    ? define(["exports", "@widget-up-demo/jquery3"], n)
    : n(
        ((e =
          "undefined" != typeof globalThis
            ? globalThis
            : e || self).Register_jquery3 = {}),
        e.RuntimeComponent
      );
})(this, function (e, n) {
  "use strict";
  (e.render = function (e) {
    var o = e.rootElement;
    if (o) {
      var t = n.Component().get(0);
      t && o.appendChild(t);
    } else console.error("Root element not found.");
  }),
    (e.unmount = function (e) {
      e.rootElement.innerHTML = "";
    });
});
