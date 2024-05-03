!(function (e, n) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = n(require("@widget-up-demo/jquery3")))
    : "function" == typeof define && define.amd
    ? define(["@widget-up-demo/jquery3"], n)
    : ((e =
        "undefined" != typeof globalThis
          ? globalThis
          : e || self).RegisterRender_jquery3 = n(e.RuntimeComponent));
})(this, function (e) {
  "use strict";
  return function (n) {
    var o = n.rootElement;
    if (o) {
      o.innerHTML = "";
      var t = e.Component().get(0);
      t && o.appendChild(t);
    } else console.error("Root element not found.");
  };
});
