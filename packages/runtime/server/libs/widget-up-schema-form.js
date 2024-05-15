!(function (e, n) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = n(require("jquery")))
    : "function" == typeof define && define.amd
    ? define(["jquery"], n)
    : ((e =
        "undefined" != typeof globalThis ? globalThis : e || self).SchemaForm =
        n(e.$));
})(this, function (e) {
  "use strict";
  function n(n, a) {
    var t = e("<label></label>").text(n);
    return e("<div class='border-b py-1 flex items-start gap-1'></div>")
      .append(t)
      .append(a);
  }
  function a(c, r, i, l) {
    var u, p;
    void 0 === i && (i = "");
    var d = i ? "".concat(i, ".").concat(c.name) : c.name,
      s = r ? r[c.name] : void 0;
    switch (c.type) {
      case "string":
      case "number":
      case "date":
      case "color":
      case "file":
      case "range":
        (p = e(
          '<input type="'
            .concat(c.type, '" name="')
            .concat(d, '" class="border rounded p-1" />')
        )),
          void 0 !== s && p.val(s),
          l &&
            p.on("input", function (e) {
              l(d, p.val(), e);
            });
        break;
      case "boolean":
        (p = e(
          '<input type="checkbox" name="'.concat(d, '" class="mt-2"/>')
        )).prop("checked", !0 === s),
          l &&
            p.on("input", function (e) {
              l(d, p.is(":checked"), e);
            });
        break;
      case "enum":
        (p = e('<div class="inline-flex flex-wrap"></div>')),
          c.options.forEach(function (n) {
            var a = e("<input>", {
              type: "radio",
              name: d,
              value: n.value,
              class: "mr-1.5",
            });
            n.value === s && a.prop("checked", !0),
              a.on("input", function (e) {
                null == l || l(d, n.value, e);
              });
            var t = e("<label class='mr-4'>")
              .append(a)
              .append(document.createTextNode(n.label));
            e(p).append(t);
          });
        break;
      case "select":
        (p = e(
          '<select name="'.concat(d, '" class="border rounded p-1"></select>')
        )),
          c.multiSelect && p.attr("multiple", "multiple"),
          c.options.forEach(function (n) {
            var a = e(
              '<option value="'
                .concat(n.value, '">')
                .concat(n.label, "</option>")
            );
            (null == s ? void 0 : s.includes(n.value)) &&
              a.prop("selected", !0),
              p.append(a);
          }),
          l &&
            p.on("input", function (n) {
              var a = e(n.currentTarget).val();
              l(d, a, n);
            });
        break;
      case "array":
        p = e("<div class='array-input border p-2'></div>");
        var v = e(
          "<button type='button' class='bg-blue-500 text-white px-2 py-1 rounded my-1'>新增</button>"
        ).on("click", function () {
          var n = t(c, d, {}, l, p.children(".array-item").length);
          p.append(n), l && l(d, o(p), e.Event("add"));
        });
        p.append(v),
          s &&
            s.forEach(function (e, n) {
              var a = t(c, d, e, l, n);
              p.append(a);
            });
        break;
      case "object":
        (p = e("<div class='border p-2'></div>")),
          null === (u = c.children) ||
            void 0 === u ||
            u.forEach(function (e) {
              p.append(n(e.label + ": ", a(e, r, d, l)));
            });
        break;
      default:
        (p = e('<input name="'.concat(d, '" class="border rounded p-1" />'))),
          void 0 !== s && p.val(s),
          l &&
            p.on("input", function (e) {
              l(d, p.val(), e);
            });
    }
    return p;
  }
  function t(t, c, r, i, l) {
    var u,
      p = e(
        "<div class='array-item border p-2 mb-2 flex items-center gap-1'></div>"
      ),
      d = "".concat(c, "[").concat(l, "]"),
      s = e("<div class='item-inner flex-grow'></div>");
    null === (u = t.children) ||
      void 0 === u ||
      u.forEach(function (e) {
        s.append(n(e.label + ": ", a(e, r, d, i)));
      });
    var v = e(
      "<button type='button' class='bg-red-500 text-white px-2 py-1 rounded my-1'>删除</button>"
    ).on("click", function () {
      p.remove(), i && i(c, o(p.parent()), e.Event("remove"));
    });
    return p.append(s).append(v), p;
  }
  function o(n) {
    var a = [];
    return (
      n.find(".array-item").each(function (n, t) {
        var o = {};
        e(t)
          .find("input, select")
          .each(function (n, a) {
            var t,
              c,
              r =
                null !==
                  (c =
                    null === (t = e(a).attr("name")) || void 0 === t
                      ? void 0
                      : t.split(".").pop()) && void 0 !== c
                  ? c
                  : "",
              i = e(a).val();
            "checkbox" === e(a).attr("type")
              ? (o[r] = e(a).is(":checked"))
              : (o[r] = i);
          }),
          a.push(o);
      }),
      a
    );
  }
  return function (t) {
    var o,
      c = t.formSchema,
      r = t.initialValues,
      i = t.onChange,
      l = e("<form></form>");
    return (
      null === (o = null == c ? void 0 : c.inputs) ||
        void 0 === o ||
        o.forEach(function (e) {
          var t = a(e, r, "", i),
            o = n(e.label + ": ", t);
          l.append(o);
        }),
      l
    );
  };
});
