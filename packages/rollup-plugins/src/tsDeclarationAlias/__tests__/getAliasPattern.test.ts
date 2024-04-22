import { getAliasPattern } from "../getAliasPattern";

describe("aliasPattern RegExp", () => {
  test("matches simple import", () => {
    expect('import something from "module"').toMatch(getAliasPattern("module"));
  });

  test("matches simple export", () => {
    expect('export something from "module"').toMatch(getAliasPattern("module"));
  });

  test("matches import type", () => {
    expect('import type { Type } from "module"').toMatch(
      getAliasPattern("module")
    );
  });

  test("matches export type", () => {
    expect('export type { Type } from "module"').toMatch(
      getAliasPattern("module")
    );
  });

  test("matches named imports", () => {
    expect('import { something } from "module"').toMatch(
      getAliasPattern("module")
    );
  });

  test("matches default imports", () => {
    expect('import something from "module"').toMatch(getAliasPattern("module"));
  });

  test("matches mixed imports", () => {
    expect('import defaultExport, { namedExport } from "module"').toMatch(
      getAliasPattern("module")
    );
  });

  test("does not match incomplete import", () => {
    expect('import from "module"').not.toMatch(getAliasPattern("module"));
  });

  test("does not match incomplete export", () => {
    expect('export from "module"').not.toMatch(getAliasPattern("module"));
  });

  test("does not match incorrect format", () => {
    expect('import { something from "module"').not.toMatch(
      getAliasPattern("module")
    );
    expect('export { something from "module"').not.toMatch(
      getAliasPattern("module")
    );
  });

  test("does not match similar keywords", () => {
    expect('important something from "module"').not.toMatch(
      getAliasPattern("module")
    );
    expect('expost something from "module"').not.toMatch(
      getAliasPattern("module")
    );
  });

  test("does not match statements without quotes", () => {
    expect("import something from module").not.toMatch(
      getAliasPattern("module")
    );
  });

  test("does not match non-import/export JavaScript code", () => {
    expect("function exportStuff() {}").not.toMatch(getAliasPattern("module"));
  });

  test("does not match export with missing braces", () => {
    expect('export something, another from "module"').not.toMatch(
      getAliasPattern("module")
    );
  });

  test("does not match strings that contain import/export inside", () => {
    expect('We need to import these materials from "module"').not.toMatch(
      getAliasPattern("module")
    );
  });

  test("matches imports with single quotes", () => {
    expect("import something from 'module'").toMatch(getAliasPattern("module"));
  });

  test("matches exports with single quotes", () => {
    expect("export something from 'module'").toMatch(getAliasPattern("module"));
  });

  test("matches imports with semicolon at the end", () => {
    expect("import something from 'module';").toMatch(
      getAliasPattern("module")
    );
  });

  test("matches exports with semicolon at the end", () => {
    expect("export something from 'module';").toMatch(
      getAliasPattern("module")
    );
  });

  test("matches multiple import/export statements in one line", () => {
    expect("import { a } from 'module'; export { b } from 'module'").toMatch(
      getAliasPattern("module")
    );
  });

  test("matches compressed import/export code", () => {
    expect("import{a}from'module';export{b}from'module'").toMatch(
      getAliasPattern("module")
    );
  });

  test("matches import/export in multiline format", () => {
    expect(`import {
      a
    } from 'module'; export {
      b
    } from "module"`).toMatch(getAliasPattern("module"));
  });

  test("should match default imports", () => {
    const pattern = getAliasPattern("react");
    const statement = "import React from 'react';";
    expect(statement.match(pattern)).not.toBeNull();
  });

  test("should match named imports", () => {
    const pattern = getAliasPattern("lodash");
    const statement = "import { map, reduce } from 'lodash';";
    expect(statement.match(pattern)).not.toBeNull();
  });

  test("should match default and named imports", () => {
    const pattern = getAliasPattern("react");
    const statement = "import React, { useState } from 'react';";
    expect(statement.match(pattern)).not.toBeNull();
  });

  test("should match all imports with *", () => {
    const pattern = getAliasPattern("react");
    const statement = "import * as React from 'react';";
    expect(statement.match(pattern)).not.toBeNull();
  });

  test("should match multiple module names", () => {
    const pattern = getAliasPattern("react|lodash");
    const statements = [
      "import React from 'react';",
      "import lodash from 'lodash';",
      "import { map, reduce } from 'lodash';",
    ];
    statements.forEach((statement) => {
      expect(statement.match(pattern)).not.toBeNull();
    });
  });

  test("matches simple import with |", () => {
    expect(
      "import React from 'react';".match(getAliasPattern("lodash|react"))
    ).toEqual(expect.arrayContaining(["import React from 'react';"]));
  });

  test("should handle multiple different imports", () => {
    const fileContent = `
      import React from 'react';
      import lodash from 'lodash';
      import { map, reduce } from 'lodash';
    `;
    const pattern = getAliasPattern("lodash|react");

    // 使用 match 方法获取所有匹配，并存储结果
    const matches = fileContent.match(pattern);

    console.log("matches", matches);

    // 验证匹配的总数是否为3
    expect(matches).toHaveLength(3);

    // 额外验证，确保每个期望的字符串都被正确匹配
    expect(matches).toEqual(
      expect.arrayContaining([
        expect.stringContaining("import React from 'react';"),
        expect.stringContaining("import lodash from 'lodash';"),
        expect.stringContaining("import { map, reduce } from 'lodash';"),
      ])
    );
  });

  test("should not match non-matching imports", () => {
    const pattern = getAliasPattern("react");
    const statement = "import Vue from 'vue';";
    expect(statement.match(pattern)).toBeNull();
  });
});
