import { stripUMDWrapper } from ".";

describe("clearFactory", () => {
  it("should handle complex UMD scripts correctly", () => {
    const scriptContent = `
        !(function (e, o) {
          "object" == typeof exports && "undefined" != typeof module
            ? o(exports, require("jquery"))
            : "function" == typeof define && define.amd
            ? define(["exports", "jquery"], o)
            : o(
                ((e =
                  "undefined" != typeof globalThis
                    ? globalThis
                    : e || self).Component_jquery3 = {}),
                e.$
              );
        })(this, function (e, o) {
          "use strict";
          var t = function () {
            var e = o("<button>Hi Button</button>").css({ color: "red" });
            return (
              e.on("click", function () {
                "rgb(255, 0, 0)" === e.css("color")
                  ? e.css("color", "blue")
                  : e.css("color", "red");
              }),
              e
            );
          };
          (e.Component = t),
            (e.default = t),
            Object.defineProperty(e, "__esModule", { value: !0 });
        });
      `;
    const result = stripUMDWrapper({ scriptContent });
    expect(result).toMatchInlineSnapshot(`
      "function wrap(e, o) {
                "object" == typeof exports && "undefined" != typeof module
                  ? o(exports, require("jquery"))
                  : "function" == typeof define && define.amd
                  ? define(["exports", "jquery"], o)
                  : o(
                      ((e =
                        "undefined" != typeof globalThis
                          ? globalThis
                          : e || self).Component_jquery3 = {}),
                      e.$
                    );
              }"
    `);
  });

  it("should handle complex UMD scripts correctly", () => {
    const scriptContent = `
    !(function (e, t) {
        "object" == typeof exports && "undefined" != typeof module
          ? t(exports, require("react"))
          : "function" == typeof define && define.amd
          ? define(["exports", "react"], t)
          : t(
              ((e =
                "undefined" != typeof globalThis
                  ? globalThis
                  : e || self).Component_react16_2 = {}),
              e.React
            );
      })(this, function (e, t) {
        "use strict";
        var n = function () {
          var e = t.useState("green"),
            n = e[0],
            o = e[1];
          return t.createElement(
            "button",
            {
              style: { color: n },
              onClick: function () {
                o(function (e) {
                  return "green" === e ? "blue" : "green";
                });
              },
            },
            "hi button 2"
          );
        };
        (e.Component = n),
          (e.default = n),
          Object.defineProperty(e, "__esModule", { value: !0 });
      });
      `;
    const result = stripUMDWrapper({ scriptContent });
    expect(result).toMatchInlineSnapshot(`
      "function wrap(e, t) {
              "object" == typeof exports && "undefined" != typeof module
                ? t(exports, require("react"))
                : "function" == typeof define && define.amd
                ? define(["exports", "react"], t)
                : t(
                    ((e =
                      "undefined" != typeof globalThis
                        ? globalThis
                        : e || self).Component_react16_2 = {}),
                    e.React
                  );
            }"
    `);
  });

  it("should handle complex UMD scripts correctly", () => {
    const scriptContent = `
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
      `;
    const result = stripUMDWrapper({ scriptContent });
    expect(result).toMatchInlineSnapshot(`
      "function wrap(e, o) {
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
            }"
    `);
  });

  it("should handle complex UMD scripts correctly", () => {
    const scriptContent = `
    'use strict';

    (function (global, factory) {
      typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
      typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
      (global = global || self, factory(global.ReactDOM = {}, global.React));
    }(this, (function (exports, React) { 'use strict';
      console.log('react-dom16.js')
    }))); 
      
      `;
    const result = stripUMDWrapper({ scriptContent });
    expect(result).toMatchInlineSnapshot(`
      "function wrap(global, factory) {
            typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
            typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
            (global = global || self, factory(global.ReactDOM = {}, global.React));
          }"
    `);
  });

  it("should handle complex UMD scripts correctly", () => {
    const scriptContent = `
    /**
     * @license React
     * react.development.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    (function (global, factory) {
      typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
      typeof define === 'function' && define.amd ? define(['exports'], factory) :
      (global = global || self, factory(global.React = {}));
    }(this, (function (exports) { 'use strict';
      console.log('hi')
    })));
      `;
    const result = stripUMDWrapper({ scriptContent });
    expect(result).toMatchInlineSnapshot(`
      "function wrap(global, factory) {
            typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
            typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = global || self, factory(global.React = {}));
          }"
    `);
  });

  it("should handle complex UMD scripts correctly", () => {
    const scriptContent = `
    ( function( global, factory ) {

      "use strict";
    
      if ( typeof module === "object" && typeof module.exports === "object" ) {
    
        module.exports = global.document ?
          factory( global, true ) :
          function( w ) {
            if ( !w.document ) {
              throw new Error( "jQuery requires a window with a document" );
            }
            return factory( w );
          };
      } else {
        factory( global );
      }
    
    // Pass this if window is not defined yet
    } )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {
    
    // Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
    // throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
    // arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
    // enough that all such attempts are guarded in a try block.
    "use strict";

  } );

      `;
    const result = stripUMDWrapper({ scriptContent });
    expect(result).toMatchInlineSnapshot(`""`);
  });
});
