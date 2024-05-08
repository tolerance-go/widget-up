import { convertConfigUmdToAliasImports } from ".";

describe("convertConfigUmdToAliasImports", () => {
  it("base", () => {
    const result = convertConfigUmdToAliasImports({
      umdConfig: {
        name: "MyComponent",
        external: ['rollup'],
        globals: {
          rollup: "Rollup",
        },
        dependenciesEntries: {
          rollup: {
            development: "/dist/rollup.min.js",
            production: "/dist/rollup.js",
          }
        }
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
