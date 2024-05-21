import { convertUmdConfigToAliasImports } from ".";

describe("convertConfigUmdToAliasImports", () => {
  it("base", () => {
    const result = convertUmdConfigToAliasImports({
      external: ["rollup"],
      globals: {
        rollup: "Rollup",
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
