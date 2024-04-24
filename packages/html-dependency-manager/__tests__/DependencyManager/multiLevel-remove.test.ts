import { DependencyManager } from "@/src/DependencyManager";

describe('DependencyManager', () => {
  let depManager: DependencyManager;

  beforeEach(() => {
    depManager = new DependencyManager({
      "lodash": ["4.17.15", "4.17.20", "4.17.21"],
      "react": ["16.8.0", "16.12.0", "17.0.0"],
      "axios": ["0.19.0", "0.19.2", "0.21.1"]
    });
  });

  test('should add multi-level dependencies', () => {
    depManager.addDependency('react', '^16.8.0', {
      "lodash": "^4.17.15"
    });
    const reactDep = depManager.getDependencies()['react'][0];
    expect(reactDep.subDependencies['lodash']).toBeDefined();
    expect(reactDep.subDependencies['lodash'].version).toBe("4.17.21");
  });

  test('should remove top-level dependency and all its sub-dependencies', () => {
    depManager.addDependency('react', '^16.8.0', {
      "lodash": "^4.17.15",
      "axios": "^0.19.0"
    });
    depManager.removeDependency('react', '^16.8.0');
    expect(depManager.getDependencies()['react']).toBeUndefined();
  });

  test('should handle nested dependencies on removal', () => {
    depManager.addDependency('react', '^16.8.0', {
      "lodash": "^4.17.15"
    });
    depManager.addDependency('axios', '^0.19.0');

    depManager.removeDependency('lodash', '^4.17.15');
    expect(depManager.getDependencies()['react'][0].subDependencies['lodash'].version).toBe('4.17.21');
    expect(depManager.getDependencies()['axios']).toBeDefined();
    expect(depManager.getDependencies()['lodash']).toBeDefined();
  });
});
