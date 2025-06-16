export default function cleanText(name: string): string {
  let result = name;
  while (/\([^()]*\)/.test(result)) {
    result = result.replace(/\([^()]*\)/g, "");
  }
  return result.trim();
}
