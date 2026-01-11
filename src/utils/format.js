export function getDomain(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

export function truncate(text, max = 140) {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "...";
}
