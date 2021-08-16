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
  fr: {
     shorthand: "En Fr",
     body: "Cette page est disponible en français",
     open: "Consulter",
     cancel: "Ne plus me le rappeler",
  },
  ja: {
    shorthand: "日本語",
    body: "このページを日本語で利用しますか？",
    open: "利用する",
    cancel: "質問を表示しない",
  },
  ko: {
    shorthand: "한국어",
    body: "해당 페이지를 한국어로 이용할 수 있습니다",
    open: "이용하기",
    cancel: "더 이상 묻지 않습니다",
  },
  pl: {
    shorthand: "Po polsku",
    body: "Ta strona jest dostępna po polsku",
    open: "Zmień język",
    cancel: "Nie pytaj ponownie",
  },
  pt: {
    shorthand: "Em Pt",
    body: "Esta página está disponível em Português",
    open: "Trocar língua",
    cancel: "Não perguntar novamente",
  },
  zh: {
    shorthand: "中文",
    body: "当前页面有中文版本",
    open: "跳转",
    cancel: "不再询问",
  },
}
