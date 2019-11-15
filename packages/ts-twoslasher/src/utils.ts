export function escapeHtml(text: string) {
  return text.replace(/</g, "&lt;");
}

export function strrep(text: string, count: number) {
  let s = "";
  for (let i = 0; i < count; i++) {
      s += text;
  }
  return s;
}

export function textToAnchorName(text: string) {
  return text.toLowerCase().replace(/ /g, "-").replace(/`|#|\//g, "");
}

export function fileNameToUrlName(s: string) {
  return s.replace(/ /g, "-").replace(/#/g, "sharp").toLowerCase();
}
