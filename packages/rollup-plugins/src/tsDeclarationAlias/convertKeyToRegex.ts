export function convertKeyToRegex(key: string): string {
  return key.replace("*", "(.*)");
}
