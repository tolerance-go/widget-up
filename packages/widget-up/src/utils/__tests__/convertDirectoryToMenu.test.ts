import { MenuItem } from "../../getPlugins/runtimeHtmlPlugin";
import { DirectoryStructure } from "../../parseDirectoryStructure";
import { convertDirectoryToMenu } from "../convertDirectoryToMenuMeta";

describe("convertDirectoryToMenu", () => {
  it("should convert a single file to a menu item without children", () => {
    const directory: DirectoryStructure[] = [
      { name: "file.txt", type: "file" },
    ];
    const expected: MenuItem[] = [{ name: "file.txt" }];
    expect(convertDirectoryToMenu(directory)).toEqual(expected);
  });

  it("should convert a single directory with no children to a menu item without children", () => {
    const directory: DirectoryStructure[] = [
      { name: "emptyFolder", type: "directory" },
    ];
    const expected: MenuItem[] = [{ name: "emptyFolder" }];
    expect(convertDirectoryToMenu(directory)).toEqual(expected);
  });

  it("should convert nested directories correctly", () => {
    const directory: DirectoryStructure[] = [
      {
        name: "root",
        type: "directory",
        children: [
          { name: "file1.txt", type: "file" },
          {
            name: "subfolder",
            type: "directory",
            children: [{ name: "file2.txt", type: "file" }],
          },
        ],
      },
    ];
    const expected: MenuItem[] = [
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
    expect(convertDirectoryToMenu(directory)).toEqual(expected);
  });

  it("should handle an empty directory array gracefully", () => {
    const directory: DirectoryStructure[] = [];
    const expected: MenuItem[] = [];
    expect(convertDirectoryToMenu(directory)).toEqual(expected);
  });
});
