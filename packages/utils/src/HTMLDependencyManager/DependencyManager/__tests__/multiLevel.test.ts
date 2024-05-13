import { DependencyManager } from "@/src/HTMLDependencyManager/DependencyManager";

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

    expect(dependencies.react.length).toBe(1);
    expect(dependencies.redux.length).toBe(1);
    expect(dependencies["react-dom"].length).toBe(1);
    expect(dependencies["react-redux"].length).toBe(1);

    expect(dependencies.react[0].subDependencies["react-dom"].version.exact).toBe(
      "16.8.0",
    );
    expect(dependencies.react[0].subDependencies.redux.version.exact).toBe("4.0.5");
    expect(dependencies.redux[0].subDependencies["react-redux"].version.exact).toBe(
      "7.2.0",
    );
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

    expect(dependencies.redux[0].subDependencies["react-redux"].version.exact).toBe(
      "7.2.0",
    );
    expect(dependencies["react-redux"][0].subDependencies.react.version.exact).toBe(
      "16.8.0",
    );
    expect(
      dependencies["react-redux"][0].subDependencies["react-dom"].version.exact,
    ).toBe("16.8.0");
  });
});
