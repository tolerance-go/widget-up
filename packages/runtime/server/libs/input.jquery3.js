!(function (e, n) {
  "object" == typeof exports && "undefined" != typeof module
    ? n(exports, require("runtime-component"))
    : "function" == typeof define && define.amd
    ? define(["exports", "runtime-component"], n)
    : n(
        ((e =
          "undefined" != typeof globalThis
            ? globalThis
            : e || self).Connector_jquery3 = {}),
        e.RuntimeComponent
      );
})(this, function (e, n) {
  "use strict";
  (e.render = function (e) {
    var o = e.rootElement,
      t = e.component;
    if (o) {
      var i = null != t ? t : n.Component().get(0);
      i && o.appendChild(i);
    } else console.error("Root element not found.");
  }),
    (e.unmount = function (e) {
      e.rootElement.innerHTML = "";
    });
});
