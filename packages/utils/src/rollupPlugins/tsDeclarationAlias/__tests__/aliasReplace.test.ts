import { aliasReplace } from "../aliasReplace";
import { jest } from "@jest/globals";

describe("aliasReplace function", () => {
  const replaceFunc = jest.fn((dependPath) => `./local/${dependPath}`);

  afterEach(() => {
    replaceFunc.mockClear();
  });

  test("should replace single default import", () => {
    const fileContent = `import React from 'react';`;
    const expected = `import React from './local/react';`;
    expect(aliasReplace(fileContent, "react", replaceFunc)).toBe(expected);
    expect(replaceFunc).toHaveBeenCalledWith("react");
  });

  test("@/styles/index.less", () => {
    const fileContent = `import 'styles/index.less';`;
    const expected = `import './local/styles/index.less';`;
    expect(aliasReplace(fileContent, "styles/index.less", replaceFunc)).toBe(
      expected
    );
    expect(replaceFunc).toHaveBeenCalledWith("styles/index.less");
  });

  test("should replace named imports", () => {
    const fileContent = `import { useState, useEffect } from 'react';`;
    const expected = `import { useState, useEffect } from './local/react';`;
    expect(aliasReplace(fileContent, "react", replaceFunc)).toBe(expected);
    expect(replaceFunc).toHaveBeenCalledWith("react");
  });

  test("should replace default and named imports", () => {
    const fileContent = `import React, { useState } from 'react';`;
    const expected = `import React, { useState } from './local/react';`;
    expect(aliasReplace(fileContent, "react", replaceFunc)).toBe(expected);
    expect(replaceFunc).toHaveBeenCalledWith("react");
  });

  test("should replace all imports", () => {
    const fileContent = `import * as React from 'react';`;
    const expected = `import * as React from './local/react';`;
    expect(aliasReplace(fileContent, "react", replaceFunc)).toBe(expected);
    expect(replaceFunc).toHaveBeenCalledWith("react");
  });

  test("should handle multiple different imports", () => {
    const fileContent = `
      import React from 'react';
      import lodash from 'lodash';
      import { map, reduce } from 'lodash';
    `;
    const expected = `
      import React from './local/react';
      import lodash from './local/lodash';
      import { map, reduce } from './local/lodash';
    `;
    expect(aliasReplace(fileContent, "lodash|react", replaceFunc)).toBe(
      expected
    );
    expect(replaceFunc).toHaveBeenCalledWith("react");
    expect(replaceFunc).toHaveBeenCalledWith("lodash");
  });

  test("should not replace non-matching imports", () => {
    const fileContent = `import Vue from 'vue';`;
    expect(aliasReplace(fileContent, "react", replaceFunc)).toBe(fileContent);
    expect(replaceFunc).not.toHaveBeenCalled();
  });
});
