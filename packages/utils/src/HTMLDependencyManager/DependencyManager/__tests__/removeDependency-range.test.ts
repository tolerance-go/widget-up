import { DependencyManager } from "@/src/htmlDependencyManager/dependencyManager";

describe('DependencyManager', () => {
  let depManager: DependencyManager;

  beforeEach(() => {
    depManager = new DependencyManager({
      "lodash": ["4.17.15", "4.17.20", "4.17.21"],
      "react": ["16.8.0", "16.12.0", "17.0.0"]
    });
  });

  test('should remove the highest version that matches the range', () => {
    depManager.addDependency('lodash', '4.17.15');
    depManager.addDependency('lodash', '4.17.20');
    depManager.addDependency('lodash', '4.17.21');

    depManager.removeDependency('lodash', '^4.17.15');
    expect(depManager.getDependencies()['lodash']).toBeDefined();
    expect(depManager.getDependencies()['lodash'].length).toBe(2);
    expect(depManager.getDependencies()['lodash'].find(dep => dep.version.exact === '4.17.21')).toBeUndefined();
  });

  test('should not remove anything if no versions match', () => {
    depManager.addDependency('lodash', '4.17.15');

    depManager.removeDependency('lodash', '^4.18.0');
    expect(depManager.getDependencies()['lodash']).toBeDefined();
    expect(depManager.getDependencies()['lodash'].length).toBe(1);
  });

  test('should handle non-existent dependencies gracefully', () => {
    expect(() => depManager.removeDependency('jquery', '^3.4.1')).not.toThrow();
    expect(depManager.getDependencies()['jquery']).toBeUndefined();
  });
});
