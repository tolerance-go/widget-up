import { getAliasPattern } from "../aliasPattern";

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
});
