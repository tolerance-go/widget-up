import { DemoMenuItem } from "widget-up-utils";
import { DirectoryStructure } from "../../parseDirectoryStructure";
import { convertDirectoryToDemo } from "../convertDirectoryToDemo";

describe("convertDirectoryToMenu", () => {
  it("should convert a single file to a menu item without children", () => {
    const directory: DirectoryStructure[] = [
      { name: "file.txt", type: "file", path: "" },
    ];
    const expected: DemoMenuItem[] = [{ name: "file.txt" }];
    expect(convertDirectoryToDemo(directory)).toEqual(expected);
  });

  it("should convert a single directory with no children to a menu item without children", () => {
    const directory: DirectoryStructure[] = [
      { name: "emptyFolder", type: "directory", path: "" },
    ];
    const expected: DemoMenuItem[] = [{ name: "emptyFolder" }];
    expect(convertDirectoryToDemo(directory)).toEqual(expected);
  });

  it("should convert nested directories correctly", () => {
    const directory: DirectoryStructure[] = [
      {
        name: "root",
        type: "directory",
        path: "",
        children: [
          { name: "file1.txt", type: "file", path: "" },
          {
            name: "subfolder",
            type: "directory",
            children: [{ name: "file2.txt", type: "file", path: "" }],
            path: "",
          },
        ],
      },
    ];
    const expected: DemoMenuItem[] = [
      {
        name: "root",
        children: [
          { name: "file1.txt" },
          {
            name: "subfolder",
            children: [{ name: "file2.txt" }],
          },
        ],
      },
    ];
    expect(convertDirectoryToDemo(directory)).toEqual(expected);
  });

  it("should handle an empty directory array gracefully", () => {
    const directory: DirectoryStructure[] = [];
    const expected: DemoMenuItem[] = [];
    expect(convertDirectoryToDemo(directory)).toEqual(expected);
  });
});
