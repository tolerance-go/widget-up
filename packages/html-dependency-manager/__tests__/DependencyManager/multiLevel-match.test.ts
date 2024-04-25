import { DependencyManager } from "@/src/DependencyManager";

describe("DependencyManager for multi-level dependencies", () => {
  let dm: DependencyManager;
  const versionList = {
    react: ["16.8.0", "17.0.1"],
    "react-dom": ["16.8.0", "17.0.1"],
    redux: ["4.0.5", "4.0.0"],
    "react-redux": ["7.2.0", "7.1.3"],
  };

  beforeEach(() => {
    dm = new DependencyManager(versionList);
  });

  test("should handle multiple levels of subdependencies", () => {
    dm.addDependency("react", "16.8.0", {
      "react-dom": "^16.0.0",
      redux: "^4.0.0",
    });
    dm.addDependency("redux", "4.0.5", {
      "react-redux": "^7.1.0",
    });

    const dependencies = dm.getDependencies();

    expect(dependencies).toMatchSnapshot();
  });

  test("should handle deep nested dependencies", () => {
    dm.addDependency("redux", "4.0.5", {
      "react-redux": "^7.1.0",
    });
    dm.addDependency("react-redux", "7.2.0", {
      react: "16.8.0",
      "react-dom": "^16.0.0",
    });

    const dependencies = dm.getDependencies();

    expect(dependencies).toMatchSnapshot();
  });

  test("should handle multiple levels of subdependencies remove", () => {
    dm.addDependency("react", "16.8.0", {
      "react-dom": "^16.0.0",
      redux: "^4.0.0",
    });
    dm.addDependency("redux", "4.0.5", {
      "react-redux": "^7.1.0",
    });

    dm.removeDependency("react", "16.8.0");

    const dependencies = dm.getDependencies();

    expect(dependencies).toMatchSnapshot();
  });

  test("getSortedDependencies should sort dependencies correctly", () => {
    const versionList = {
      react: ["16.8.0", "17.0.1"],
      "react-dom": ["16.8.0", "17.0.1"],
      redux: ["4.0.5", "4.0.0"],
      "react-redux": ["7.2.0", "7.1.3"],
    };
    const manager = new DependencyManager(versionList);

    manager.addDependency("react", "^16.8.0", { "react-dom": "^16.8.0" });
    manager.addDependency("redux", "^4.0.5", { react: "^17.0.0" });
    expect(manager.getDependencies()).toMatchSnapshot();
  });
});
