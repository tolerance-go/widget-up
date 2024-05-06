import { convertConfigUmdToAliasImports } from ".";

describe("convertConfigUmdToAliasImports", () => {
  it("base", () => {
    const result = convertConfigUmdToAliasImports({
      umdConfig: {
        name: "MyComponent",
        external: {
          rollup: {
            path: {
              development: "/dist/rollup.min.js",
              production: "/dist/rollup.js",
            },
          },
        },
        globals: {
          rollup: "Rollup",
        },
      },
    });

    expect(result).toEqual([
      {
        globalVar: "Rollup_v4_14_3",
        scopeVar: "Rollup",
      },
    ]);
  });
});
