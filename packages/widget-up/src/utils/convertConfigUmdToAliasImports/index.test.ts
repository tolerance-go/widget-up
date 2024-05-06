import { convertConfigUmdToAliasImports } from ".";

describe("convertConfigUmdToAliasImports", () => {
  it("base", () => {
    const result = convertConfigUmdToAliasImports({
      umdConfig: {
        name: "MyComponent",
        external: {
          rollup: {
            unpkg: {
              filePath: "/dist/rollup.min.js",
              filePathDev: "/dist/rollup.js",
            },
          },
        },
        globals: {
          rollup: "Rollup",
        },
      },
    });

    expect(result).toBe({
      imports: [
        {
          globalVar: "Rollup_v_4_14_3",
          scopeVar: "Rollup",
        },
      ],
    });
  });
});
