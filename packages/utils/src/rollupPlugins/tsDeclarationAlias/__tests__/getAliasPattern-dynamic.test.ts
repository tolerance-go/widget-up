import { getAliasPattern } from "../getAliasPattern";

describe("动态导入的 aliasPattern 正则表达式", () => {
  test("匹配动态导入", () => {
    expect('const module = await import("module")').toMatch(
      getAliasPattern("module")
    );
  });

  test("匹配带单引号的动态导入", () => {
    expect("const module = await import('module')").toMatch(
      getAliasPattern("module")
    );
  });

  test("匹配带空格的动态导入", () => {
    expect('const module = await import( "module" )').toMatch(
      getAliasPattern("module")
    );
  });

  test("匹配不带空格的动态导入", () => {
    expect('const module = await import("module")').toMatch(
      getAliasPattern("module")
    );
  });

  test("匹配一行中的多个动态导入语句", () => {
    expect(
      "const a = await import('module'); const b = await import('anotherModule')"
    ).toMatch(getAliasPattern("module|anotherModule"));
  });

  test("匹配多行格式的动态导入", () => {
    expect(`const module = await import(
      'module'
    )`).toMatch(getAliasPattern("module"));
  });

  test("处理多个不同的动态导入", () => {
    const fileContent = `
      const moduleA = await import('moduleA');
      const moduleB = await import('moduleB');
      const moduleC = await import('moduleC');
    `;
    const pattern = getAliasPattern("moduleA|moduleB|moduleC");

    const matches = fileContent.match(pattern);

    expect(matches).toHaveLength(3);
    expect(matches).toEqual(
      expect.arrayContaining([
        expect.stringContaining("import('moduleA')"),
        expect.stringContaining("import('moduleB')"),
        expect.stringContaining("import('moduleC')"),
      ])
    );
  });

  test("不匹配不匹配的动态导入", () => {
    const pattern = getAliasPattern("module");
    const statement = "const module = await import('anotherModule');";
    expect(statement.match(pattern)).toBeNull();
  });

  test("匹配带变量的动态导入", () => {
    const pattern = getAliasPattern("module");
    const statement = `
      const moduleName = 'module';
      const module = await import(moduleName);
    `;
    expect(statement.match(pattern)).toBeNull(); // 由于模块名是变量，这里不应匹配
  });
});
