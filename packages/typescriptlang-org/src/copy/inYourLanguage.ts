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
  todo: {
    shorthand: "In XX",
    body: "This page is available in your language",
    open: "Go",
    cancel: "Don't ask again",
  },
  es: {
    shorthand: "En Es",
    body: "Esta página está disponible en Español",
    open: "Adelante",
    cancel: "No preguntar de nuevo",
  },
  pt: {
    shorthand: "Em Pt",
    body: "Esta página está disponível em Português",
    open: "Trocar língua",
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
  pl: {
    shorthand: "Po polsku",
    body: "Ta strona jest dostępna po polsku",
    open: "Zmień język",
    cancel: "Nie pytaj ponownie",
  },
  fr: {
    shorthand: "En Fr",
    body: "Cette page est disponible en français",
    open: "Y aller",
    cancel: "Ne pas me le redemander",
  },
}
