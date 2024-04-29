import { DependencyManager } from "@/src/HTMLDependencyManager/DependencyManager";

describe('DependencyManager', () => {
  let depManager: DependencyManager;

  beforeEach(() => {
    depManager = new DependencyManager({
      "lodash": ["4.17.15", "4.17.20", "4.17.21"],
      "react": ["16.8.0", "16.12.0", "17.0.0"],
      "axios": ["0.19.0", "0.19.2", "0.21.1"]
    });
  });

  test('should recursively remove a dependency and its sub-dependencies', () => {
    depManager.addDependency('react', '^16.8.0', {
      "lodash": "^4.17.15",
      "axios": "^0.19.0"
    });
    depManager.removeDependency('react', '^16.8.0');
    expect(depManager.getDependencies()['react']).toBeUndefined();
    expect(depManager.getDependencies()['lodash']).toBeUndefined();
    expect(depManager.getDependencies()['axios']).toBeUndefined();
  });

  test('should abort removing a dependency if it is still required by another package', () => {
    depManager.addDependency('react', '^16.8.0', {
      "lodash": "^4.17.15"
    });
    depManager.addDependency('axios', '^0.19.0', {
      "lodash": "^4.17.15"
    });

    depManager.removeDependency('lodash', '^4.17.15');
    expect(depManager.getDependencies()['lodash']).toBeDefined();
    console.warn = jest.fn();
    depManager.removeDependency('react', '^16.8.0');
    expect(console.warn).toBeCalledWith(
      expect.stringContaining('still required by another package')
    );
  });
});
