import { convertPathToVariableName } from ".";

describe("convertPathToVariableName", () => {
  test("should replace slashes with underscores", () => {
    expect(convertPathToVariableName("user/profile/data")).toBe(
      "user_profile_data"
    );
  });

  test("should handle filenames with extension", () => {
    expect(convertPathToVariableName("index.ts")).toBe("index_ts");
  });

  test("should replace spaces and special characters", () => {
    expect(convertPathToVariableName("new folder/image (1).png")).toBe(
      "new_folder_image__1__png"
    );
  });

  test("should add underscore if the result starts with a digit", () => {
    expect(convertPathToVariableName("2021/04/01/data.log")).toBe(
      "_2021_04_01_data_log"
    );
  });

  test("should handle empty input", () => {
    expect(convertPathToVariableName("")).toBe("");
  });

  test("should handle paths with multiple special characters", () => {
    expect(
      convertPathToVariableName("node_modules/@types/node/index.d.ts")
    ).toBe("node_modules__types_node_index_d_ts");
  });

  test("should correctly replace backslashes from Windows paths", () => {
    expect(convertPathToVariableName("documents\\2021\\report.doc")).toBe(
      "documents_2021_report_doc"
    );
  });
});
