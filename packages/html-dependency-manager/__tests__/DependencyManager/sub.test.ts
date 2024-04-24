import { DependencyManager } from "@/src/DependencyManager";

describe("DependencyManager sub", () => {
  let dm: DependencyManager;
  const versionList = {
    react: ["16.8.0", "17.0.1", "16.0.0", "15.6.2"],
    lodash: ["4.17.21", "4.17.15", "4.16.0"],
    "react-dom": ["16.8.0", "17.0.1", "16.0.0"],
  };

  beforeEach(() => {
    dm = new DependencyManager(versionList);
  });

  test("should handle subdependencies when adding a new dependency", () => {
    dm.addDependency("react", "16.8.0", { "react-dom": "^16.0.0" });
    expect(
      dm.getDependencies()["react"][0].subDependencies["react-dom"].version,
    ).toBe("16.8.0");
  });

  test("should update subdependencies when the main dependency version is updated", () => {
    dm.addDependency("react", "16.8.0", { "react-dom": "16.0.0" });
    dm.addDependency("react", "16.8.0", { "react-dom": "^16.0.0" }); // Updated range that includes 16.8.0
    expect(
      dm.getDependencies()["react"][0].subDependencies["react-dom"].version,
    ).toBe("16.8.0");
  });

  test("should add multiple subdependencies with correct versions", () => {
    dm.addDependency("react", "16.8.0", {
      lodash: "4.17.15",
      "react-dom": "^16.0.0",
    });
    expect(
      dm.getDependencies()["react"][0].subDependencies["lodash"].version,
    ).toBe("4.17.15");
    expect(
      dm.getDependencies()["react"][0].subDependencies["react-dom"].version,
    ).toBe("16.8.0");
  });

  test("should not add a subdependency if no version in the list matches the range", () => {
    dm.addDependency("react", "16.8.0", { "react-dom": "^18.0.0" });
    expect(dm.getDependencies()["react"][0].subDependencies).not.toHaveProperty(
      "react-dom",
    );
  });

  test("should handle version ranges by selecting the best match from the list for subdependencies", () => {
    dm.addDependency("react", "16.8.0", { "react-dom": "^15.0.0" });
    expect(dm.getDependencies()["react"][0].subDependencies["react-dom"]).toBe(
      undefined,
    );
  });
});
