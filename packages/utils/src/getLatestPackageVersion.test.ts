import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { getLatestPackageVersion } from "./getLatestPackageVersion";

describe("getLatestPackageVersion", () => {
  const mock = new MockAdapter(axios);

  afterEach(() => {
    mock.reset();
  });

  it("should handle edge case where the exact lower version matches the semver range", async () => {
    const packageName = "react";
    const semverRange = "^16.13.0";
    const versions = {
      "16.13.0": {},
      "16.14.0": {},
    };

    mock
      .onGet(`https://registry.npmmirror.com/${packageName}`)
      .reply(200, { versions });

    const expectedVersion = "16.14.0";
    const actualVersion = await getLatestPackageVersion(
      packageName,
      semverRange
    );
    expect(actualVersion).toBe(expectedVersion);
  });

  it("should ignore prerelease versions when the range does not include them", async () => {
    const packageName = "react";
    const semverRange = "^16.13.0";
    const versions = {
      "16.12.0": {},
      "16.13.1-alpha": {},
      "16.14.0": {},
    };

    mock
      .onGet(`https://registry.npmmirror.com/${packageName}`)
      .reply(200, { versions });

    const expectedVersion = "16.14.0";
    const actualVersion = await getLatestPackageVersion(
      packageName,
      semverRange
    );
    expect(actualVersion).toBe(expectedVersion);
  });

  it("should return the latest prerelease version when it's included in the semver range", async () => {
    const packageName = "react";
    const semverRange = "^16.13.0-beta";
    const versions = {
      "16.12.0": {},
      "16.13.0-beta.2": {},
      "16.13.0-beta.3": {},
    };

    mock
      .onGet(`https://registry.npmmirror.com/${packageName}`)
      .reply(200, { versions });

    const expectedVersion = "16.13.0-beta.3";
    const actualVersion = await getLatestPackageVersion(
      packageName,
      semverRange
    );
    expect(actualVersion).toBe(expectedVersion);
  });

  it("should throw an error when there are no versions available", async () => {
    const packageName = "react";
    const semverRange = "^16.13.0";
    const versions = {};

    mock
      .onGet(`https://registry.npmmirror.com/${packageName}`)
      .reply(200, { versions });

    await expect(
      getLatestPackageVersion(packageName, semverRange)
    ).rejects.toThrow("No matching version found");
  });

  it("should handle network failures gracefully", async () => {
    const packageName = "react";
    const semverRange = "^16.13.0";

    mock.onGet(`https://registry.npmmirror.com/${packageName}`).networkError();

    await expect(
      getLatestPackageVersion(packageName, semverRange)
    ).rejects.toThrow();
  });

  it("should return the latest patch version for a tilde range", async () => {
    const packageName = "react";
    const semverRange = "~16.13.0";
    const versions = {
      "16.13.0": {},
      "16.13.1": {},
      "16.13.2": {},
      "16.14.0": {},
    };

    mock
      .onGet(`https://registry.npmmirror.com/${packageName}`)
      .reply(200, { versions });

    const expectedVersion = "16.13.2";
    const actualVersion = await getLatestPackageVersion(
      packageName,
      semverRange
    );
    expect(actualVersion).toBe(expectedVersion);
  });

  it("should return the latest stable version when no range is specified", async () => {
    const packageName = "react";
    const versions = {
      "16.12.0": {},
      "16.13.0": {},
      "17.0.0": {},
      "17.0.1": {},
      "18.0.0-alpha": {}, // 确保预发布版本被忽略
    };

    mock
      .onGet(`https://registry.npmmirror.com/${packageName}`)
      .reply(200, { versions });

    const expectedVersion = "17.0.1";
    const actualVersion = await getLatestPackageVersion(packageName, "");
    expect(actualVersion).toBe(expectedVersion);
  });
});
