interface URLParams {
  [key: string]: string;
}

export function getURLSearchParams(url: string): URLParams {
  const params: URLParams = {};
  // 使用 URL API 解析查询字符串
  const searchParams = new URL(url).searchParams;

  // 遍历所有参数，并添加到结果对象中
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}
