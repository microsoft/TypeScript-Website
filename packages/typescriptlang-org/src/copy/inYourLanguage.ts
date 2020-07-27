export const inYourLanguage: Record<
  string,
  { body: string; open: string; cancel: string; shorthand: string }
> = {
  en: {
    shorthand: "In En",
    body: "This page is available in English",
    open: "Go",
    cancel: "Don't ask again",
  },
  pt: {
    shorthand: "Em Pt",
    body: "Esta página está disponível em Português",
    open: "Ir",
    cancel: "Não perguntar novamente",
  },
  ja: {
    shorthand: "日本語",
    body: "このページを日本語で利用しますか？",
    open: "利用する",
    cancel: "質問を表示しない",
  },
  zh: {
    shorthand: "中文",
    body: "当前页面有中文版本",
    open: "跳转",
    cancel: "不再询问",
  },
}
