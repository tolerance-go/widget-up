export function updateURLParameters(params: Record<string, string>): void {
  // 获取当前URL
  const url = new URL(window.location.href);

  // 遍历传入的参数对象，并设置每个查询参数
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  // 使用 history API 更新浏览器的 URL，不刷新页面
  window.history.pushState({ path: url.href }, "", url.href);
}
