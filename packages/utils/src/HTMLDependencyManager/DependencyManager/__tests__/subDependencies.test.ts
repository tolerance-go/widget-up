import { DependencyManager } from "@/src/HtmlDependencyManager/DependencyManager";

describe("DependencyManager with SubDependencies", () => {
  let depManager: DependencyManager;

  beforeEach(() => {
    depManager = new DependencyManager({
      express: ["4.17.1", "4.18.1"],
      cors: ["2.8.5"],
      morgan: ["1.9.1", "1.10.0"],
    });
  });

  test("should add sub-dependency as a reference to the original dependency object", () => {
    depManager.addDependency("express", "^4.17.0", { morgan: "^1.10.0" });
    const expressDep = depManager
      .getDependencies()
      .express.find((dep) => dep.version === "4.18.1");
    const morganDep = depManager
      .getDependencies()
      .morgan.find((dep) => dep.version === "1.10.0");

    expect(expressDep!.subDependencies["morgan"]).toBe(morganDep);
  });

  test("should not add sub-dependency if version is not satisfied", () => {
    depManager.addDependency("express", "^4.17.0", { cors: ">=3.0.0" });
    const expressDep = depManager
      .getDependencies()
      .express.find((dep) => dep.version === "4.18.1");

    expect(expressDep!.subDependencies["cors"]).toBeUndefined();
  });

  test("sub-dependency should be the actual dependency detail object from the main dependency list", () => {
    depManager.addDependency("express", "^4.17.0", { morgan: "^1.9.0" });
    const expressDep = depManager
      .getDependencies()
      .express.find((dep) => dep.version === "4.18.1");
    const morganDep = depManager
      .getDependencies()
      .morgan.find((dep) => dep.version === "1.10.0");

    expect(expressDep!.subDependencies["morgan"]).toBe(morganDep);
    expect(morganDep!.version).toEqual("1.10.0");
  });
});
