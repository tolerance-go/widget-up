import { MenuItem } from "@/types";
import { DirectoryStructure } from "../parseDirectoryStructure";

export function convertDirectoryToMenu(
  directory: DirectoryStructure[],
): MenuItem[] {
  return directory.map((item) => {
    // Create the basic menu item from the directory item
    const menuItem: MenuItem = { name: item.name };

    // If the item is a directory and has children, recursively convert them
    if (item.type === "directory" && item.children) {
      menuItem.children = convertDirectoryToMenu(item.children);
    }

    return menuItem;
  });
}
